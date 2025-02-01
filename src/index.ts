import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/schemas/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { getUser } from './middleware/auth.middleware.js';
import { environment } from './config/environment.js';
import { handleError } from './middleware/error.middleware.js';
import type { Context } from './graphql/context.js';

async function startServer() {
  try {
    // Create Apollo Server
    const server = new ApolloServer<Context>({
      typeDefs,
      resolvers,
      formatError: handleError,
    });

    // Connect to MongoDB
    await mongoose.connect(environment.mongodbUri);
    console.log('📦 Connected to MongoDB');

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(' ')[1] || '';
        const user = await getUser(token);
        return { user };
      },
    });

    console.log(`🚀 Server ready at ${url}`);

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      try {
        await server.stop();
        await mongoose.connection.close();
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
