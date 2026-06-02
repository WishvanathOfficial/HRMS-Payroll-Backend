import { StatusCodes } from 'http-status-codes';

/**
 * Operational application error.
 *
 * Throw an ApiError in services/controllers and the global error handler will
 * format a consistent JSON response. Non-operational (programmer) errors are
 * converted to 500s automatically.
 */
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errors?: unknown;

    constructor(statusCode: number, message: string, errors?: unknown, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }

    static badRequest(message = 'Bad Request', errors?: unknown) {
        return new ApiError(StatusCodes.BAD_REQUEST, message, errors);
    }
    static unauthorized(message = 'Unauthorized', errors?: unknown) {
        return new ApiError(StatusCodes.UNAUTHORIZED, message, errors);
    }
    static forbidden(message = 'Forbidden', errors?: unknown) {
        return new ApiError(StatusCodes.FORBIDDEN, message, errors);
    }
    static notFound(message = 'Not Found', errors?: unknown) {
        return new ApiError(StatusCodes.NOT_FOUND, message, errors);
    }
    static conflict(message = 'Conflict', errors?: unknown) {
        return new ApiError(StatusCodes.CONFLICT, message, errors);
    }
    static unprocessable(message = 'Unprocessable Entity', errors?: unknown) {
        return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message, errors);
    }
    static internal(message = 'Internal Server Error', errors?: unknown) {
        return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message, errors, false);
    }
}

export default ApiError;
