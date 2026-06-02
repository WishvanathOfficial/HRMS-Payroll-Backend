import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route/middleware handler so thrown errors and rejected
 * promises are forwarded to the global error handler.
 */
export const catchAsync =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export default catchAsync;
