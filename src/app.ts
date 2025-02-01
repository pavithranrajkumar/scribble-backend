import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { typeDefs } from './graphql/schemas/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { createContext } from './graphql/context.js';
import { handleError } from './middleware/error.middleware.js';
import { setupGlobalErrorHandlers } from './utils/error-handler.js';

// Setup global error handlers
setupGlobalErrorHandlers();

const app = express();

try {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: handleError,
    plugins: [
      {
        requestDidStart: async () => ({
          // Log the start of each operation
          willSendResponse(requestContext) {
            const { errors } = requestContext.response;
            if (errors) {
              errors.forEach((error) => {
                console.error('[GraphQL Error]', {
                  message: error.message,
                  path: error.path,
                  extensions: error.extensions,
                  originalError: error.originalError,
                });
              });
            }
          },
          // Log parsing errors
          parsingDidStart() {
            return (err) => {
              if (err) {
                console.error('[GraphQL Parsing Error]', err);
              }
            };
          },
          // Log validation errors
          validationDidStart() {
            return (errs) => {
              if (errs) {
                errs.forEach((err) => {
                  console.error('[GraphQL Validation Error]', err);
                });
              }
            };
          },
          // Log execution errors
          executionDidStart() {
            return {
              willResolveField({ info }) {
                const start = Date.now();
                return (error, result) => {
                  if (error) {
                    console.error('[GraphQL Execution Error]', {
                      field: `${info.parentType.name}.${info.fieldName}`,
                      error,
                      duration: Date.now() - start,
                    });
                  }
                };
              },
            };
          },
        }),
      },
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: createContext,
    })
  );
} catch (error) {
  console.error('[Apollo Server Setup Error]', error);
  process.exit(1);
}

// Express error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Express Error]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Handle 404 errors
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

export default app;
