import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env';

/**
 * Sensible default rate limit applied to /api/v1.
 *
 * 300 requests per minute per IP is generous for a regular HRMS client but
 * tight enough to slow down brute-force / scraping abuse. Tweak via env if
 * the upstream proxy or LB already handles rate-limiting.
 */
export const apiRateLimiter = rateLimit({
    windowMs: 60_000,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
        message: 'Too many requests, please try again later',
    },
});

export default apiRateLimiter;
