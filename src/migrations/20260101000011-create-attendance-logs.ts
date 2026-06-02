import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'AttendanceLogs';

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
                logDate: { field: 'LogDate', type: Sequelize.DATEONLY, allowNull: false },
                checkIn: { field: 'CheckIn', type: Sequelize.DATE, allowNull: true },
                checkOut: { field: 'CheckOut', type: Sequelize.DATE, allowNull: true },
                workHours: { field: 'WorkHours', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE', 'HOLIDAY'),
                    allowNull: false,
                    defaultValue: 'PRESENT',
                },
                source: {
                    field: 'Source',
                    type: Sequelize.ENUM('BIOMETRIC', 'WEB', 'MOBILE', 'MANUAL'),
                    allowNull: false,
                    defaultValue: 'WEB',
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
        // One row per employee per day + drives date-range lookups
        try {
            await queryInterface.addIndex(TABLE_NAME, ['EmployeeId', 'LogDate'], { unique: true, transaction });
        } catch (err: any) {
            if (err.original?.code !== 'ER_DUP_KEYNAME') throw err;
        }
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
