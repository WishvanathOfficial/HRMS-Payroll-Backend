import { QueryInterface, literal, DataTypes } from 'sequelize';

const TABLE_NAME = 'SalaryStructureComponents';

export const up = (queryInterface: QueryInterface, Sequelize: typeof DataTypes) =>
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
                structureId: {
                    field: 'StructureId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'SalaryStructures', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                componentId: {
                    field: 'ComponentId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'SalaryComponents', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                amount: { field: 'Amount', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                percentage: { field: 'Percentage', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
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
        try {
            await queryInterface.addIndex(TABLE_NAME, ['StructureId', 'ComponentId'], { unique: true, transaction });
        } catch (err: unknown) {
            const code = (err as { original?: { code?: string } } | null | undefined)?.original?.code;
            if (code !== 'ER_DUP_KEYNAME') throw err;
        }
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
