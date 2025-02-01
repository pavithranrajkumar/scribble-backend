import { GraphQLError } from 'graphql';
import { AppError } from '../utils/errors.js';
import { handleOperationalError } from '../utils/error-handler.js';

export function handleError(error: any) {
  // If it's already a GraphQL error, just log and return it
  if (error instanceof GraphQLError) {
    console.error('[GraphQL Error]', error);
    return error;
  }

  // If it's our custom AppError, convert it to GraphQL error
  if (error instanceof AppError) {
    return handleOperationalError(error);
  }

  // Handle Mongoose/MongoDB errors
  if (error.name === 'ValidationError') {
    return new GraphQLError('Validation Error', {
      extensions: {
        code: 'BAD_USER_INPUT',
        errors: Object.values(error.errors).map((err: any) => err.message),
      },
    });
  }

  if (error.name === 'CastError') {
    return new GraphQLError('Invalid ID format', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }

  // For unknown errors, log them and return a generic error
  console.error('[Unexpected Error]', {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });

  return new GraphQLError('Internal server error', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
