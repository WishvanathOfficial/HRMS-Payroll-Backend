import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { sequelize, testConnection } from './config/database';
import { runPendingMigrations, runPendingSeeders } from './db/migrator';

// Importing models registers them on the singleton Sequelize instance and
// wires their associations. Must happen before any service call.
import './models';

/**
 * Bootstraps the API server.
 *
 *   1. Verify MySQL connectivity.
 *   2. Run pending migrations (auto-sync schema for any new tables/columns).
 *   3. Optionally run pending seeders.
 *   4. Start the HTTP server.
 *   5. Wire graceful shutdown.
 */
const start = async (): Promise<void> => {
    try {
        await testConnection();
        logger.info('[db] MySQL connection established');

        if (env.autoMigrate) {
            logger.info('[db] Running pending migrations...');
            await runPendingMigrations();
        } else {
            logger.warn('[db] AUTO_MIGRATE=false — skipping migration check');
        }

        if (env.autoSeed) {
            logger.info('[db] Running pending seeders...');
            await runPendingSeeders();
        }

        const server = http.createServer(app);
        server.listen(env.port, () => {
            logger.info(`[server] HRMS Backend listening on http://localhost:${env.port}${env.apiPrefix}`);
            logger.info(`[env] mode=${env.nodeEnv}`);
        });

        const shutdown = (signal: string) => {
            logger.warn(`[server] ${signal} received, shutting down gracefully...`);
            server.close(async (err) => {
                if (err) logger.error('[server] Error closing HTTP server', { err });
                try {
                    await sequelize.close();
                    logger.info('[server] Sequelize connection closed. Bye.');
                    process.exit(err ? 1 : 0);
                } catch (e) {
                    logger.error('[server] Error closing DB connection', { err: e });
                    process.exit(1);
                }
            });
            // Force exit if shutdown hangs.
            setTimeout(() => {
                logger.error('[server] Forced shutdown after 10s');
                process.exit(1);
            }, 10_000).unref();
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

        process.on('unhandledRejection', (reason) => {
            logger.error('[server] Unhandled promise rejection', { reason });
        });
        process.on('uncaughtException', (err) => {
            logger.error('[server] Uncaught exception', { err });
            process.exit(1);
        });
    } catch (err) {
        logger.error('[server] Startup failed', { err });
        process.exit(1);
    }
};

start();
