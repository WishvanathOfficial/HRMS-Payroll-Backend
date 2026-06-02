import winston from 'winston';
import { env } from './env';

const { combine, timestamp, printf, colorize, errors, splat, json } = winston.format;

/**
 * Safe JSON stringify that handles circular references and non-serializable objects.
 */
const safeStringify = (obj: unknown): string => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (_, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    });
};

const consoleFormat = printf(({ level, message, timestamp: ts, stack, ...rest }) => {
    const extras = Object.keys(rest).length ? ` ${safeStringify(rest)}` : '';
    return `${ts} [${level}] ${stack || message}${extras}`;
});

export const logger = winston.createLogger({
    level: env.log.level,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        splat(),
        env.nodeEnv === 'production' ? json() : combine(colorize(), consoleFormat),
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false,
});

/**
 * Stream adapter so morgan can pipe HTTP logs through winston.
 */
export const morganStream = {
    write: (msg: string) => logger.http?.(msg.trim()) ?? logger.info(msg.trim()),
};

export default logger;
