import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
    ValidationError as SequelizeValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    DatabaseError,
    EmptyResultError,
} from 'sequelize';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/**
 * Centralized error handler.
 *
 * Translates Sequelize errors into ApiError so the JSON envelope stays
 * consistent. Hides stack traces in production.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    let apiError: ApiError;

    if (err instanceof ApiError) {
        apiError = err;
    } else if (err instanceof UniqueConstraintError) {
        apiError = ApiError.conflict(
            'Unique constraint violated',
            err.errors.map((e) => ({ field: e.path, message: e.message })),
        );
    } else if (err instanceof ForeignKeyConstraintError) {
        apiError = ApiError.badRequest('Foreign key constraint failed', {
            table: err.table,
            fields: err.fields,
        });
    } else if (err instanceof SequelizeValidationError) {
        apiError = ApiError.unprocessable(
            'Validation failed',
            err.errors.map((e) => ({ field: e.path, message: e.message })),
        );
    } else if (err instanceof EmptyResultError) {
        apiError = ApiError.notFound('Resource not found');
    } else if (err instanceof DatabaseError) {
        apiError = ApiError.internal('Database error', env.nodeEnv === 'production' ? undefined : err.message);
    } else if (err instanceof SyntaxError && 'body' in (err as object)) {
        apiError = ApiError.badRequest('Malformed JSON body');
    } else {
        apiError = ApiError.internal((err as Error)?.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
    }

    const logPayload = {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: apiError.statusCode,
        message: apiError.message,
        errors: apiError.errors,
    };
    if (apiError.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
        logger.error('Request failed', { ...logPayload, stack: (err as Error)?.stack });
    } else {
        logger.warn('Request rejected', logPayload);
    }

    const body: Record<string, unknown> = {
        success: false,
        statusCode: apiError.statusCode,
        message: apiError.message,
        requestId: req.id,
    };
    if (apiError.errors !== undefined) body.errors = apiError.errors;
    if (env.nodeEnv !== 'production' && err instanceof Error) body.stack = err.stack;

    res.status(apiError.statusCode).json(body);
};

export default errorHandler;
