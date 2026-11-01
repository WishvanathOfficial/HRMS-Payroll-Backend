/**
 * Tiny CLI wrapper around the Umzug migrator/seeder.
 * Used by npm scripts: `npm run db:migrate`, `db:migrate:down`, `db:migrate:status`,
 * `db:seed`, `db:reset`.
 */
import { migrator, seeder, runPendingMigrations, runPendingSeeders } from './migrator';
import { sequelize } from '../config/database';
import { logger } from '../config/logger';
import { env } from '../config/env';

const main = async () => {
    const cmd = process.argv[2];
    try {
        switch (cmd) {
            case 'up':
                await runPendingMigrations();
                break;
            case 'down':
                await migrator.down();
                logger.info('[cli] Last migration rolled back.');
                break;
            case 'status': {
                const executed = await migrator.executed();
                const pending = await migrator.pending();
                logger.info(`[cli] Executed (${executed.length}): ${executed.map((m) => m.name).join(', ') || '—'}`);
                logger.info(`[cli] Pending  (${pending.length}): ${pending.map((m) => m.name).join(', ') || '—'}`);
                break;
            }
            case 'seed':
                await runPendingSeeders();
                break;
            case 'seed:down':
                await seeder.down();
                logger.info('[cli] Last seeder rolled back.');
                break;
            case 'reset': {
                if (env.nodeEnv === 'production') {
                    throw new Error('db:reset is disabled in production because it destroys application data');
                }
                try {
                    logger.info('[cli] Rolling back all migrations...');
                    let count = 0;
                    let executed = await migrator.executed();
                    while (executed.length > 0) {
                        await migrator.down();
                        count++;
                        executed = await migrator.executed();
                    }
                    logger.info(`[cli] Rolled back ${count} migration(s).`);
                    logger.info('[cli] Applying all migrations...');
                    await migrator.up();
                    logger.info('[cli] Seeding database...');
                    const queryInterface = sequelize.getQueryInterface();
                    const tables = await queryInterface.showAllTables();
                    if (tables.includes('SequelizeSeeds')) await queryInterface.dropTable('SequelizeSeeds');
                    await runPendingSeeders();
                    logger.info('[cli] Reset complete.');
                } catch (resetErr) {
                    logger.error('[cli] Reset failed', { err: resetErr });
                    throw resetErr;
                }
                break;
            }
            default:
                logger.error(`[cli] Unknown command: ${cmd}. Use up | down | status | seed | reset`);
                process.exit(1);
        }
    } catch (err) {
        logger.error('[cli] Command failed', { err });
        process.exit(1);
    } finally {
        await sequelize.close();
    }
};

main();
