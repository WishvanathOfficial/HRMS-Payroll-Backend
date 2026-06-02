import { requireRoles } from './requireRoles';
import { ApiError } from '../utils/ApiError';
import { mockRequest, mockResponse, mockNext } from '../__tests__/helpers/express';

describe('requireRoles middleware', () => {
    it('rejects when req.user is missing (401)', () => {
        const req = mockRequest();
        const next = mockNext();
        requireRoles('ADMIN')(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
        expect((next.mock.calls[0][0] as ApiError).statusCode).toBe(401);
    });

    it('rejects when the user has none of the allowed roles (403)', () => {
        const req = mockRequest();
        req.user = { userId: 1, employeeId: 1, email: 'a@b.com', roles: ['EMPLOYEE'] };
        const next = mockNext();
        requireRoles('ADMIN', 'HR')(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
        expect((next.mock.calls[0][0] as ApiError).statusCode).toBe(403);
    });

    it('allows when the user has at least one of the allowed roles', () => {
        const req = mockRequest();
        req.user = { userId: 1, employeeId: 1, email: 'a@b.com', roles: ['HR'] };
        const next = mockNext();
        requireRoles('ADMIN', 'HR')(req, mockResponse() as never, next);
        expect(next).toHaveBeenCalledWith();
    });
});
