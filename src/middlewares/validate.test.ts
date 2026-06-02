import Joi from 'joi';
import { validate, numericParam } from './validate';
import { ApiError } from '../utils/ApiError';
import { mockRequest, mockResponse, mockNext } from '../__tests__/helpers/express';

describe('validate middleware', () => {
    it('passes valid body through', () => {
        const schema = { body: Joi.object({ name: Joi.string().required() }) };
        const req = mockRequest({ body: { name: 'ok' } });
        const next = mockNext();
        validate(schema)(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('forwards an ApiError(422) on invalid body', () => {
        const schema = { body: Joi.object({ name: Joi.string().required() }) };
        const req = mockRequest({ body: {} });
        const next = mockNext();
        validate(schema)(req, mockResponse() as never, next);

        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
        const err = next.mock.calls[0][0] as ApiError;
        expect(err.statusCode).toBe(422);
    });

    it('strips unknown keys and coerces types', () => {
        const schema = { query: Joi.object({ page: Joi.number().integer().required() }) };
        const req = mockRequest({ query: { page: '3', extra: 'noise' } as never });
        const next = mockNext();
        validate(schema)(req, mockResponse() as never, next);

        expect(next).toHaveBeenCalledWith();
        expect(req.query).toEqual({ page: 3 });
    });
});

describe('numericParam middleware', () => {
    it('accepts positive integer', () => {
        const req = mockRequest({ params: { id: '42' } as never });
        const next = mockNext();
        numericParam()(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('rejects non-numeric', () => {
        const req = mockRequest({ params: { id: 'abc' } as never });
        const next = mockNext();
        numericParam()(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
});
