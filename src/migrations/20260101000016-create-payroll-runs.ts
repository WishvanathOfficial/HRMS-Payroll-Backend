import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'PayrollRuns';

export const up = (queryInterface: QueryInterface, Sequelize: any) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.createTable(
            TABLE_NAME,
            {
                id: {
                    field: 'Id',
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                month: { field: 'Month', type: Sequelize.TINYINT, allowNull: false },
                year: { field: 'Year', type: Sequelize.SMALLINT, allowNull: false },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('DRAFT', 'PROCESSING', 'COMPLETED', 'FAILED', 'LOCKED'),
                    allowNull: false,
                    defaultValue: 'DRAFT',
                },
                processedAt: { field: 'ProcessedAt', type: Sequelize.DATE, allowNull: true },
                processedBy: {
                    field: 'ProcessedBy',
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: 'Employees', key: 'Id' },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                },
                createdBy: { field: 'CreatedBy', type: Sequelize.STRING },
                createdOn: {
                    field: 'CreatedOn',
                    type: Sequelize.DATE(6),
                    defaultValue: literal('CURRENT_TIMESTAMP(6)'),
                    allowNull: false,
                },
                updatedBy: { field: 'UpdatedBy', type: Sequelize.STRING },
                updatedOn: {
                    field: 'UpdatedOn',
                    type: Sequelize.DATE(6),
                    defaultValue: literal('CURRENT_TIMESTAMP(6)'),
                    allowNull: false,
                },
            },
            { transaction },
        );
        // Only one run per month/year
        try {
            await queryInterface.addIndex(TABLE_NAME, ['Month', 'Year'], { unique: true, transaction });
        } catch (err: any) {
            if (err.original?.code !== 'ER_DUP_KEYNAME') throw err;
        }
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
