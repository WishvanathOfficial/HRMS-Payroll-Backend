import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'LeaveBalances';

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
                employeeId: {
                    field: 'EmployeeId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Employees', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                leaveTypeId: {
                    field: 'LeaveTypeId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'LeaveTypes', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                year: { field: 'Year', type: Sequelize.INTEGER, allowNull: false },
                allocated: { field: 'Allocated', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                used: { field: 'Used', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                balance: { field: 'Balance', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
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
        // One balance row per (employee, leave_type, year)
        await queryInterface.addIndex(TABLE_NAME, ['EmployeeId', 'LeaveTypeId', 'Year'], { unique: true, transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
