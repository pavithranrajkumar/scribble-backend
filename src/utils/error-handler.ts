import { GraphQLError } from 'graphql';

function logError(error: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, {
    message: error.message,
    stack: error.stack,
    // Add any additional context you want to log
    ...(error.extensions && { extensions: error.extensions }),
  });
}

export function setupGlobalErrorHandlers() {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logError(error);
    console.error('[Uncaught Exception] 💥 Shutting down...');
    // Give the server 1 second to finish current requests before shutting down
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (error: any) => {
    logError(error);
    console.error('[Unhandled Rejection] 💥 Shutting down...');
    // Give the server 1 second to finish current requests before shutting down
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    console.info('SIGTERM received. 👋 Graceful shutdown initiated...');
    // You can add cleanup logic here
    process.exit(0);
  });
}

export function handleOperationalError(error: any) {
  // Handle known operational errors
  if (error.isOperational) {
    return new GraphQLError(error.message, {
      extensions: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        http: { status: error.statusCode || 500 },
      },
    });
  }

  // Log programming or unknown errors
  logError(error);

  // Return generic error message to client
  return new GraphQLError('Something went wrong', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      http: { status: 500 },
    },
  });
}
