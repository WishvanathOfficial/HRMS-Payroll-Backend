import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'PayslipDetails';

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
                payslipId: {
                    field: 'PayslipId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Payslips', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                componentId: {
                    field: 'ComponentId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'SalaryComponents', key: 'Id' },
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                },
                amount: { field: 'Amount', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                componentType: {
                    field: 'ComponentType',
                    type: Sequelize.ENUM('EARNING', 'DEDUCTION'),
                    allowNull: false,
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
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
