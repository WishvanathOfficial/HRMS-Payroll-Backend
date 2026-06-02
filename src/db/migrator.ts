import * as path from 'path';
import * as fs from 'fs';
import { Umzug, SequelizeStorage } from 'umzug';
import { QueryInterface, Sequelize as SequelizeStatic, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { logger } from '../config/logger';

/**
 * Auto-migrator (Umzug)
 *
 * Each migration file is plain CommonJS (.js) and exports
 *   { up(queryInterface, Sequelize), down(queryInterface, Sequelize) }
 * matching sequelize-cli conventions.
 *
 * The migrator is invoked on server startup (see src/server.ts) so any newly
 * added migration is automatically applied to the DB. Already-executed
 * migrations are tracked in the `SequelizeMeta` table.
 */

// Glob picks up *.js from the migrations folder regardless of whether we're
// running from `src/` (dev via ts-node) or `dist/` (compiled).
const migrationsGlob = path.resolve(__dirname, '..', 'migrations', '*.{js,ts}');
const seedersGlob = path.resolve(__dirname, '..', 'seeders', '*.{js,ts}');

const resolveMigration = ({
    name,
    path: filepath,
    context,
}: {
    name: string;
    path?: string;
    context: QueryInterface;
}) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(filepath!);
    return {
        name,
        up: async () => mod.up(context, SequelizeStatic),
        down: async () => mod.down(context, SequelizeStatic),
    };
};

const log = {
    info: (m: unknown) => logger.info(typeof m === 'string' ? m : JSON.stringify(m)),
    warn: (m: unknown) => logger.warn(typeof m === 'string' ? m : JSON.stringify(m)),
    error: (m: unknown) => logger.error(typeof m === 'string' ? m : JSON.stringify(m)),
    debug: (m: unknown) => logger.debug(typeof m === 'string' ? m : JSON.stringify(m)),
};

export const migrator = new Umzug({
    migrations: { glob: migrationsGlob, resolve: resolveMigration },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
    logger: log,
});

export const seeder = new Umzug({
    migrations: { glob: seedersGlob, resolve: resolveMigration },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeSeeds' }),
    logger: log,
});

/** Apply all pending migrations. Safe to call on every app start. */
export const runPendingMigrations = async (): Promise<void> => {
    const pending = await migrator.pending();
    if (pending.length === 0) {
        logger.info('[migrator] No pending migrations — DB schema is up-to-date.');
        return;
    }
    logger.info(`[migrator] ${pending.length} pending migration(s): ${pending.map((p) => p.name).join(', ')}`);
    const executed = await migrator.up();
    logger.info(`[migrator] Applied ${executed.length} migration(s).`);
};

/** Apply all pending seeders (idempotent — tracked in SequelizeSeeds). */
export const runPendingSeeders = async (): Promise<void> => {
    try {
        // Ensure SequelizeSeeds table exists before initializing seeder
        await sequelize.getQueryInterface().createTable(
            'SequelizeSeeds',
            {
                name: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: SequelizeStatic.fn('now'),
                },
            },
        ).catch(() => {
            // Table might already exist, ignore error
        });

        // Remove seeder entries from SequelizeMeta if they exist (they should be in SequelizeSeeds instead)
        const seederNames = [
            '20260101000001-organization.ts',
            '20260101000002-employees.ts',
            '20260101000003-attendance.ts',
            '20260101000004-leave.ts',
            '20260101000005-salary.ts',
            '20260101000006-payroll.ts',
            '20260101000007-recruitment.ts',
            '20260101000008-appraisal.ts',
            '20260101000009-roles-and-admin.ts',
        ];
        for (const name of seederNames) {
            await sequelize.getQueryInterface().sequelize.query(
                'DELETE FROM SequelizeMeta WHERE name = ?',
                { replacements: [name], raw: true },
            ).catch(() => {
                // Might fail if no such entry
            });
        }

        // Reinitialize seeder after cleanup
        const seederReinit = new Umzug({
            migrations: { glob: seedersGlob, resolve: resolveMigration },
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeSeeds' }),
            logger: log,
        });

        logger.info('[seeder] Fetching pending seeders...');
        const pending = await seederReinit.pending();
        const executed = await seederReinit.executed();
        logger.info(`[seeder] Executed seeders (${executed.length}): ${executed.map((e) => e.name).join(', ') || '—'}`);
        logger.info(`[seeder] Pending seeders (${pending.length}): ${pending.map((p) => p.name).join(', ') || '—'}`);
        if (pending.length === 0) {
            logger.info('[seeder] No pending seeders.');
            return;
        }
        logger.info(`[seeder] ${pending.length} pending seeder(s): ${pending.map((p) => p.name).join(', ')}`);
        const result = await seederReinit.up();
        logger.info(`[seeder] Applied ${result.length} seeder(s).`);
    } catch (err) {
        logger.error('[seeder] Error running seeders', { err });
        throw err;
    }
};
