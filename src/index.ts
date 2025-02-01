import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/schemas/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { getUser } from './middleware/auth.middleware.js';
import { environment } from './config/environment.js';
import type { Context } from './graphql/context.js';

async function startServer() {
  try {
    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Connect to MongoDB
    await mongoose.connect(environment.mongodbUri, {
      rejectUnauthorized: false,
    });
    console.log('📦 Connected to MongoDB');

    const { url } = await startStandaloneServer(server, {
      listen: { port: parseInt(process.env.PORT || '4000') },
      context: async ({ req }): Promise<Context> => {
        const token = req.headers.authorization?.split(' ')[1] || '';
        const user = await getUser(token);
        return { user };
      },
    });

    console.log(`🚀 Server ready at ${url}`);
    console.log(`🏥 Health check available at ${url}/.well-known/apollo/server-health`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
