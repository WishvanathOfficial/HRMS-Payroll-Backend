jest.mock('../../../services/auth.service', () => ({
    authService: {
        login: jest.fn(),
        refresh: jest.fn(),
        register: jest.fn(),
        me: jest.fn(),
        changePassword: jest.fn(),
    },
}));

import { authController } from './auth.controller';
import { authService } from '../../../services/auth.service';
import { ApiError } from '../../../utils/ApiError';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = authService as unknown as Record<string, jest.Mock>;

describe('authController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('login delegates with email + password', async () => {
        svc.login.mockResolvedValue({ user: {}, tokens: {} });
        const res = mockResponse();
        await authController.login(mockRequest({ body: { email: 'a@b.com', password: 'pw' } }), res as never);
        expect(svc.login).toHaveBeenCalledWith('a@b.com', 'pw');
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('refresh delegates', async () => {
        svc.refresh.mockResolvedValue({});
        const res = mockResponse();
        await authController.refresh(mockRequest({ body: { refreshToken: 't' } }), res as never);
        expect(svc.refresh).toHaveBeenCalledWith('t');
    });

    it('register returns 201', async () => {
        svc.register.mockResolvedValue({});
        const res = mockResponse();
        await authController.register(mockRequest({ body: { email: 'x@y.com', password: 'pw12345!' } }), res as never);
        expect(svc.register).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('me 401s without req.user', async () => {
        await expect(authController.me(mockRequest(), mockResponse() as never)).rejects.toBeInstanceOf(ApiError);
    });

    it('me delegates to service when authenticated', async () => {
        svc.me.mockResolvedValue({});
        const req = mockRequest();
        req.user = { userId: 1, employeeId: 1, email: 'a@b.com', roles: ['ADMIN'] };
        await authController.me(req, mockResponse() as never);
        expect(svc.me).toHaveBeenCalledWith(1);
    });

    it('changePassword delegates with old/new', async () => {
        svc.changePassword.mockResolvedValue(undefined);
        const req = mockRequest({ body: { oldPassword: 'a', newPassword: 'b' } });
        req.user = { userId: 1, employeeId: 1, email: 'a@b.com', roles: ['EMPLOYEE'] };
        await authController.changePassword(req, mockResponse() as never);
        expect(svc.changePassword).toHaveBeenCalledWith(1, 'a', 'b');
    });

    it('logout returns 200 even with no body', async () => {
        const res = mockResponse();
        await authController.logout(mockRequest(), res as never);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
