import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'ON_LEAVE' | 'HOLIDAY';
export type AttendanceSource = 'BIOMETRIC' | 'WEB' | 'MOBILE' | 'MANUAL';

export interface AttendanceLogAttributes {
    id: number;
    employeeId: number;
    logDate: string;
    checkIn: Date | string | null;
    checkOut: Date | string | null;
    workHours: number;
    status: AttendanceStatus;
    source: AttendanceSource;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AttendanceLogCreationAttributes extends Optional<
    AttendanceLogAttributes,
    | 'id'
    | 'checkIn'
    | 'checkOut'
    | 'workHours'
    | 'status'
    | 'source'
    | 'createdBy'
    | 'createdOn'
    | 'updatedBy'
    | 'updatedOn'
> {}

export const AttendanceLog: ModelDefined<AttendanceLogAttributes, AttendanceLogCreationAttributes> = sequelize.define(
    'AttendanceLog',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
        logDate: { field: 'LogDate', type: DataTypes.DATEONLY, allowNull: false },
        checkIn: { field: 'CheckIn', type: DataTypes.DATE, allowNull: true },
        checkOut: { field: 'CheckOut', type: DataTypes.DATE, allowNull: true },
        workHours: { field: 'WorkHours', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        status: {
            field: 'Status',
            type: DataTypes.ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE', 'HOLIDAY'),
            allowNull: false,
            defaultValue: 'PRESENT',
        },
        source: {
            field: 'Source',
            type: DataTypes.ENUM('BIOMETRIC', 'WEB', 'MOBILE', 'MANUAL'),
            allowNull: false,
            defaultValue: 'WEB',
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'AttendanceLogs',
        timestamps: false,
        indexes: [
            // One record per employee per day + drives date-range lookups
            { unique: true, fields: ['EmployeeId', 'LogDate'] },
        ],
    },
);

Employee.hasMany(AttendanceLog, { foreignKey: 'employeeId', sourceKey: 'id', as: 'attendance' });
AttendanceLog.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
