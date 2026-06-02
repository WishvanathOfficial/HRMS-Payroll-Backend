import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'Payslips';

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
                payrollRunId: {
                    field: 'PayrollRunId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'PayrollRuns', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                employeeId: {
                    field: 'EmployeeId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Employees', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                grossSalary: { field: 'GrossSalary', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                totalDeductions: {
                    field: 'TotalDeductions',
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
                netSalary: { field: 'NetSalary', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                paidDays: { field: 'PaidDays', type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
                lopDays: { field: 'LopDays', type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('DRAFT', 'GENERATED', 'PAID', 'CANCELLED'),
                    allowNull: false,
                    defaultValue: 'DRAFT',
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
        // One payslip per employee per run
        await queryInterface.addIndex(TABLE_NAME, ['PayrollRunId', 'EmployeeId'], { unique: true, transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
