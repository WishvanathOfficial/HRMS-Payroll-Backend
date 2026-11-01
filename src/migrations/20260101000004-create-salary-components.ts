import { QueryInterface, literal, DataTypes } from 'sequelize';

const TABLE_NAME = 'SalaryComponents';

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
                name: { field: 'Name', type: Sequelize.STRING(80), allowNull: false, unique: true },
                type: { field: 'Type', type: Sequelize.ENUM('EARNING', 'DEDUCTION'), allowNull: false },
                calcType: {
                    field: 'CalcType',
                    type: Sequelize.ENUM('FIXED', 'PERCENTAGE'),
                    allowNull: false,
                    defaultValue: 'FIXED',
                },
                value: { field: 'Value', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                taxable: { field: 'Taxable', type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
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
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
