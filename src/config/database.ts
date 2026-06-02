import { Sequelize } from 'sequelize';
import { env } from './env';
import { logger } from './logger';

/**
 * Single Sequelize instance reused across the app.
 * Models import this to call `Model.init(...)`.
 */
export const sequelize = new Sequelize({
    dialect: env.db.dialect,
    host: env.db.host,
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    database: env.db.database,
    pool: {
        min: env.db.poolMin,
        max: env.db.poolMax,
        acquire: 30000,
        idle: 10000,
    },
    logging: env.db.logging ? (sql) => logger.debug(sql) : false,
    define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
    },
    timezone: '+00:00',
});

export const testConnection = async (): Promise<void> => {
    await sequelize.authenticate();
};

export default sequelize;
