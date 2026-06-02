import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { AuthenticatedUser } from '../services/auth.service';

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthenticatedUser;
    }
}

/**
 * Verifies the `Authorization: Bearer <jwt>` header and attaches the decoded
 * user payload (userId, employeeId, email, roles) to `req.user`. Throws 401
 * if the token is missing, malformed, or expired.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.header('Authorization') || '';
    const [scheme, token] = header.split(' ');

    if (!token || scheme?.toLowerCase() !== 'bearer') {
        return next(ApiError.unauthorized('Missing or malformed Authorization header'));
    }

    try {
        const decoded = jwt.verify(token, env.auth.jwtSecret) as JwtPayload;
        req.user = {
            userId: decoded.userId as number,
            employeeId: (decoded.employeeId as number | null) ?? null,
            email: decoded.email as string,
            roles: (decoded.roles as AuthenticatedUser['roles']) || [],
        };
        return next();
    } catch {
        return next(ApiError.unauthorized('Invalid or expired token'));
    }
};

export default authenticate;
