import jwt from 'jsonwebtoken';
import { authenticate } from './authenticate';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { mockRequest, mockResponse, mockNext } from '../__tests__/helpers/express';

describe('authenticate middleware', () => {
    const validToken = () =>
        jwt.sign({ userId: 1, employeeId: 2, email: 'a@b.com', roles: ['ADMIN'] }, env.auth.jwtSecret, {
            expiresIn: '1h',
        });

    it('rejects requests without an Authorization header', () => {
        const req = mockRequest({ header: () => '' } as never);
        const next = mockNext();
        authenticate(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
        expect((next.mock.calls[0][0] as ApiError).statusCode).toBe(401);
    });

    it('rejects malformed schemes', () => {
        const req = mockRequest({ header: () => 'Basic xyz' } as never);
        const next = mockNext();
        authenticate(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });

    it('rejects invalid tokens', () => {
        const req = mockRequest({ header: () => 'Bearer not-a-jwt' } as never);
        const next = mockNext();
        authenticate(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
        expect((next.mock.calls[0][0] as ApiError).statusCode).toBe(401);
    });

    it('attaches req.user on a valid token', () => {
        const token = validToken();
        const req = mockRequest({ header: () => `Bearer ${token}` } as never);
        const next = mockNext();

        authenticate(req, mockResponse() as never, next);

        expect(next).toHaveBeenCalledWith();
        expect(req.user).toEqual(
            expect.objectContaining({ userId: 1, employeeId: 2, email: 'a@b.com', roles: ['ADMIN'] }),
        );
    });
});
