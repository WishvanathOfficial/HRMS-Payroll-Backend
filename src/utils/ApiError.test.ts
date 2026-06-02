import { ApiError } from './ApiError';
import { StatusCodes } from 'http-status-codes';

describe('ApiError', () => {
    it('preserves statusCode, message, and isOperational', () => {
        const err = new ApiError(418, "I'm a teapot");
        expect(err.statusCode).toBe(418);
        expect(err.message).toBe("I'm a teapot");
        expect(err.isOperational).toBe(true);
        expect(err).toBeInstanceOf(Error);
    });

    it('factories produce the right HTTP status', () => {
        expect(ApiError.badRequest().statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(ApiError.unauthorized().statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(ApiError.forbidden().statusCode).toBe(StatusCodes.FORBIDDEN);
        expect(ApiError.notFound().statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(ApiError.conflict().statusCode).toBe(StatusCodes.CONFLICT);
        expect(ApiError.unprocessable().statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(ApiError.internal().statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('marks internal errors as non-operational', () => {
        expect(ApiError.internal().isOperational).toBe(false);
        expect(ApiError.badRequest().isOperational).toBe(true);
    });

    it('attaches optional errors payload', () => {
        const e = ApiError.unprocessable('bad', { field: 'email' });
        expect(e.errors).toEqual({ field: 'email' });
    });
});
