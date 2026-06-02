import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'LeaveRequests';

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
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                },
                fromDate: { field: 'FromDate', type: Sequelize.DATEONLY, allowNull: false },
                toDate: { field: 'ToDate', type: Sequelize.DATEONLY, allowNull: false },
                days: { field: 'Days', type: Sequelize.FLOAT, allowNull: false },
                reason: { field: 'Reason', type: Sequelize.STRING(500), allowNull: true },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
                    allowNull: false,
                    defaultValue: 'PENDING',
                },
                approvedBy: {
                    field: 'ApprovedBy',
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
        // Drives the "pending leave requests for employee" dashboard query
        await queryInterface.addIndex(TABLE_NAME, ['EmployeeId', 'Status'], { transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
