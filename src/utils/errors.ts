export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500, public code: string = 'INTERNAL_SERVER_ERROR', public isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message = 'Bad Request') {
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static Unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static Forbidden(message = 'Forbidden') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static NotFound(message = 'Not Found') {
    return new AppError(message, 404, 'NOT_FOUND');
  }
}
