import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiSuccessPayload<T> {
    success: true;
    statusCode: number;
    message: string;
    data: T;
    meta?: { pagination?: Pagination } & Record<string, unknown>;
}

/**
 * Tiny helper that produces a consistent JSON envelope on every successful
 * response. Use it from controllers instead of `res.json(...)` directly.
 */
export class ApiResponse {
    static send<T>(res: Response, statusCode: number, data: T, message?: string, meta?: ApiSuccessPayload<T>['meta']) {
        const payload: ApiSuccessPayload<T> = {
            success: true,
            statusCode,
            message: message ?? ReasonPhrases.OK,
            data,
            ...(meta ? { meta } : {}),
        };
        return res.status(statusCode).json(payload);
    }

    static ok<T>(res: Response, data: T, message = 'Fetched successfully', meta?: ApiSuccessPayload<T>['meta']) {
        return this.send(res, StatusCodes.OK, data, message, meta);
    }

    static created<T>(res: Response, data: T, message = 'Created successfully') {
        return this.send(res, StatusCodes.CREATED, data, message);
    }

    static accepted<T>(res: Response, data: T, message = 'Accepted') {
        return this.send(res, StatusCodes.ACCEPTED, data, message);
    }

    static noContent(res: Response) {
        return res.status(StatusCodes.NO_CONTENT).send();
    }

    /** Wrap a paginated result. `rows` becomes `data`, totals → meta.pagination. */
    static paginated<T>(
        res: Response,
        rows: T[],
        pagination: { page: number; limit: number; total: number },
        message = 'Fetched successfully',
    ) {
        const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));
        return this.ok(res, rows, message, {
            pagination: { ...pagination, totalPages },
        });
    }
}

export default ApiResponse;
