/**
 * Plain-JS config file consumed by sequelize-cli.
 * The application itself uses src/config/database.ts (Sequelize instance).
 */
require('dotenv').config();

const common = {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'hrms_payroll',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    pool: {
        min: Number(process.env.DB_POOL_MIN || 2),
        max: Number(process.env.DB_POOL_MAX || 10),
    },
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
    development: common,
    test: common,
    production: common,
};
