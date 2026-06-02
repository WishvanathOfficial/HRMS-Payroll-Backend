import morgan from 'morgan';
import { env } from '../config/env';
import { morganStream } from '../config/logger';

// Register the request id as a morgan token so it shows up in every log line.
morgan.token('id', (req) => (req as unknown as { id?: string }).id || '-');

const format =
    env.log.morganFormat === 'json'
        ? ':id :method :url :status :res[content-length] - :response-time ms'
        : `[:id] ${env.log.morganFormat}`;

/** HTTP request logger — pipes morgan through winston, prefixed with request id. */
export const requestLogger = morgan(format, { stream: morganStream });

export default requestLogger;
