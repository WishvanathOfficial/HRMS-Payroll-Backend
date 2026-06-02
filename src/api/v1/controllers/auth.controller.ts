import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { ApiError } from '../../../utils/ApiError';
import { authService } from '../../../services/auth.service';

export const authController = {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const out = await authService.login(email, password);
        return ApiResponse.ok(res, out, 'Logged in');
    },

    async refresh(req: Request, res: Response) {
        const out = await authService.refresh(req.body.refreshToken);
        return ApiResponse.ok(res, out, 'Token refreshed');
    },

    async register(req: Request, res: Response) {
        const out = await authService.register(req.body);
        return ApiResponse.created(res, out, 'User registered');
    },

    async me(req: Request, res: Response) {
        if (!req.user) throw ApiError.unauthorized();
        const out = await authService.me(req.user.userId);
        return ApiResponse.ok(res, out);
    },

    async changePassword(req: Request, res: Response) {
        if (!req.user) throw ApiError.unauthorized();
        const { oldPassword, newPassword } = req.body;
        await authService.changePassword(req.user.userId, oldPassword, newPassword);
        return ApiResponse.ok(res, null, 'Password changed');
    },

    /**
     * Stateless logout — there's no server-side session to clear since JWTs
     * are self-contained. The client must drop its tokens. We keep the
     * endpoint for symmetry / future blacklist support.
     */
    async logout(_req: Request, res: Response) {
        return ApiResponse.ok(res, null, 'Logged out');
    },
};
