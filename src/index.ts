import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/schemas/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { getUser } from './middleware/auth.middleware.js';
import { environment } from './config/environment.js';
import { handleError } from './middleware/error.middleware.js';
import type { Context } from './graphql/context.js';

async function startServer() {
  try {
    const app = express();

    // Apply middleware
    app.use(cors());
    app.use(express.json());

    // Create Apollo Server
    const server = new ApolloServer<Context>({
      typeDefs,
      resolvers,
      formatError: handleError,
    });

    await server.start();

    // Apply Apollo middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          const token = req.headers.authorization?.split(' ')[1] || '';
          const user = await getUser(token);
          return { user };
        },
      })
    );

    // Connect to MongoDB
    await mongoose.connect(environment.mongodbUri);
    console.log('📦 Connected to MongoDB');

    // Start server
    const httpServer = app.listen(4000, () => {
      console.log(`🚀 Server ready`); //
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      try {
        await server.stop();
        await mongoose.connection.close();
        await new Promise<void>((resolve) => httpServer.close(() => resolve()));
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      shutdown();
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled Rejection:', error);
      shutdown();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
