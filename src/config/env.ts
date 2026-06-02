import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export type NodeEnv = 'development' | 'test' | 'production';

export const env = {
    nodeEnv: (process.env.NODE_ENV || 'development') as NodeEnv,
    port: Number(process.env.PORT || 5000),
    apiPrefix: process.env.API_PREFIX || '/api/v1',

    db: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'hrms_payroll',
        dialect: 'mysql' as const,
        poolMin: Number(process.env.DB_POOL_MIN || 2),
        poolMax: Number(process.env.DB_POOL_MAX || 10),
        logging: process.env.DB_LOGGING === 'true',
    },

    cors: {
        origin: process.env.CORS_ORIGIN || '*',
    },

    log: {
        level: process.env.LOG_LEVEL || 'info',
        morganFormat: process.env.MORGAN_FORMAT || 'dev',
    },

    /**
     * JWT authentication settings. The secrets MUST be overridden in any
     * non-development environment via env vars — the fallback strings are
     * only here to keep `npm run dev` working out-of-the-box.
     */
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'dev-only-access-secret-change-me',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-only-refresh-secret-change-me',
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 10),
    },

    /**
     * Auto-run pending migrations on app startup.
     * Default ON. Disable by setting AUTO_MIGRATE=false.
     */
    autoMigrate: process.env.AUTO_MIGRATE !== 'false',

    /**
     * Auto-run seeders on app startup (idempotent — Sequelize tracks executed seeders).
     * Default OFF; set AUTO_SEED=true if you want a seeded DB on every fresh start.
     */
    autoSeed: process.env.AUTO_SEED === 'true',
};

export default env;
