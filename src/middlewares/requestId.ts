import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare module 'express-serve-static-core' {
    interface Request {
        id: string;
    }
}

/**
 * Attaches a unique request id to every incoming request so logs can be
 * correlated end-to-end. The id is taken from the `X-Request-Id` header when
 * present (useful when the upstream load balancer assigns one), otherwise a
 * fresh UUID is generated. The id is also echoed back on the response.
 */
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
    const incoming = (req.header('X-Request-Id') || '').trim();
    req.id = incoming || uuidv4();
    res.setHeader('X-Request-Id', req.id);
    next();
};

export default requestId;
