import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export type NodeEnv = 'development' | 'test' | 'production';
const configuredNodeEnv = process.env.NODE_ENV || 'development';
if (!['development', 'test', 'production'].includes(configuredNodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
}
const nodeEnv = configuredNodeEnv as NodeEnv;
const isProduction = nodeEnv === 'production';

const parseBoolean = (name: string, fallback: boolean): boolean => {
    const value = process.env[name];
    if (value === undefined) return fallback;
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new Error(`${name} must be true or false`);
};

const parseInteger = (name: string, fallback: number, min: number, max = Number.MAX_SAFE_INTEGER): number => {
    const value = process.env[name];
    if (value === undefined) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
        throw new Error(`${name} must be an integer between ${min} and ${max}`);
    }
    return parsed;
};

const port = parseInteger('PORT', 5000, 1, 65535);
const dbPort = parseInteger('DB_PORT', 3306, 1, 65535);
const poolMin = parseInteger('DB_POOL_MIN', 2, 0);
const poolMax = parseInteger('DB_POOL_MAX', 10, 1);
const bcryptRounds = parseInteger('BCRYPT_ROUNDS', 10, 4, 31);
const rateLimitMax = parseInteger('RATE_LIMIT_MAX', 300, 1);
const autoMigrate = parseBoolean('AUTO_MIGRATE', !isProduction);
const autoSeed = parseBoolean('AUTO_SEED', false);

if (poolMin > poolMax) throw new Error('DB_POOL_MIN cannot exceed DB_POOL_MAX');

if (isProduction) {
    const required = [
        'DB_HOST',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'CORS_ORIGIN',
    ];
    const missing = required.filter((name) => !process.env[name]?.trim());
    if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);

    const secrets = [process.env.JWT_SECRET!, process.env.JWT_REFRESH_SECRET!];
    if (secrets.some((secret) => secret.length < 32 || /^(change-me|replace-with|dev-only)/i.test(secret))) {
        throw new Error('Production JWT secrets must be unique, random values of at least 32 characters');
    }
    if (secrets[0] === secrets[1]) throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different');
    if (process.env.DB_USER?.trim().toLowerCase() === 'root') {
        throw new Error('Production must use a dedicated database user, not root');
    }
    if (/^(root|admin@123|replace-with)/i.test(process.env.DB_PASSWORD!.trim())) {
        throw new Error('Production DB_PASSWORD must not use a default or placeholder value');
    }
    if (process.env.CORS_ORIGIN!.trim() === '*') {
        throw new Error('Production CORS_ORIGIN must specify an allowed origin');
    }
    if (autoSeed) throw new Error('AUTO_SEED must remain false in production; seed data manually when required');
}

export const env = {
    nodeEnv,
    port,
    apiPrefix: process.env.API_PREFIX || '/api/v1',

    db: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: dbPort,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'hrms_payroll',
        dialect: 'mysql' as const,
        poolMin,
        poolMax,
        logging: parseBoolean('DB_LOGGING', false),
    },

    cors: {
        origin: process.env.CORS_ORIGIN?.trim() || '*',
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
        bcryptRounds,
    },

    rateLimitMax,
    autoMigrate,

    /**
     * Auto-run seeders on app startup (idempotent — Sequelize tracks executed seeders).
     * Default OFF; set AUTO_SEED=true if you want a seeded DB on every fresh start.
     */
    autoSeed,
};

export default env;
