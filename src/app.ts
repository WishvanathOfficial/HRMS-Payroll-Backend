import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';

import { env } from './config/env';
import { sequelize } from './config/database';
import { errorHandler, notFoundHandler, requestLogger, requestId, apiRateLimiter } from './middlewares';
import v1 from './api/v1';

const app: Application = express();

/* --------------------------- Security & parsing -------------------------- */
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.cors.origin }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(compression());

/* ------------------------------ Observability ---------------------------- */
app.use(requestId);
app.use(requestLogger);

/* -------------------------------- Health --------------------------------- */
app.get('/', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'HRMS & Payroll Backend is running',
        data: { version: '1.0.0', docs: env.apiPrefix },
    });
});

/**
 * Health check that actually verifies DB connectivity. K8s/LB probes can hit
 * this; returns 503 if the DB is down so the orchestrator pulls this pod out.
 */
app.get(`${env.apiPrefix}/health`, async (_req: Request, res: Response) => {
    try {
        await sequelize.authenticate();
        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: 'OK',
            data: { uptime: process.uptime(), env: env.nodeEnv, db: 'up' },
        });
    } catch {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            success: false,
            statusCode: StatusCodes.SERVICE_UNAVAILABLE,
            message: 'Database unreachable',
            data: { uptime: process.uptime(), env: env.nodeEnv, db: 'down' },
        });
    }
});

/* ---------------------------------- API ---------------------------------- */
app.use(env.apiPrefix, apiRateLimiter, v1);

/* ------------------------ 404 + error handlers --------------------------- */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
