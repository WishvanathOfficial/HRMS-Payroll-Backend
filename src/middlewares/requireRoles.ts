import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { RoleName } from '../models/role';

/**
 * Role-guard middleware factory.
 *
 *   router.delete('/x/:id', authenticate, requireRoles('ADMIN'), handler);
 *
 * Allows the request through if the authenticated user has AT LEAST ONE of
 * the named roles. Use `authenticate` upstream so `req.user` is populated.
 */
export const requireRoles =
    (...allowed: RoleName[]) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) return next(ApiError.unauthorized());
        const hasRole = req.user.roles.some((r) => allowed.includes(r));
        if (!hasRole) {
            return next(ApiError.forbidden(`Requires one of: ${allowed.join(', ')}`));
        }
        return next();
    };

export default requireRoles;
