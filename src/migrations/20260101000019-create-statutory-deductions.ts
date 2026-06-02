import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'StatutoryDeductions';

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
                type: {
                    field: 'Type',
                    type: Sequelize.ENUM('PF', 'ESI', 'PT', 'TDS', 'OTHER'),
                    allowNull: false,
                },
                employeeShare: {
                    field: 'EmployeeShare',
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
                employerShare: {
                    field: 'EmployerShare',
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
                taxableIncome: {
                    field: 'TaxableIncome',
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
                tdsAmount: { field: 'TdsAmount', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
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
