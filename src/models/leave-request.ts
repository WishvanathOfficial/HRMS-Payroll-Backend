import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';
import { LeaveType } from './leave-type';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRequestAttributes {
    id: number;
    employeeId: number;
    leaveTypeId: number;
    fromDate: string;
    toDate: string;
    days: number;
    reason: string | null;
    status: LeaveStatus;
    approvedBy: number | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LeaveRequestCreationAttributes extends Optional<
    LeaveRequestAttributes,
    'id' | 'reason' | 'status' | 'approvedBy' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const LeaveRequest: ModelDefined<LeaveRequestAttributes, LeaveRequestCreationAttributes> = sequelize.define(
    'LeaveRequest',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
        leaveTypeId: { field: 'LeaveTypeId', type: DataTypes.INTEGER, allowNull: false },
        fromDate: { field: 'FromDate', type: DataTypes.DATEONLY, allowNull: false },
        toDate: { field: 'ToDate', type: DataTypes.DATEONLY, allowNull: false },
        days: { field: 'Days', type: DataTypes.FLOAT, allowNull: false },
        reason: { field: 'Reason', type: DataTypes.STRING(500), allowNull: true },
        status: {
            field: 'Status',
            type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING',
        },
        approvedBy: { field: 'ApprovedBy', type: DataTypes.INTEGER, allowNull: true },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'LeaveRequests',
        timestamps: false,
        indexes: [
            // Drives the "pending leave requests" dashboard query
            { fields: ['EmployeeId', 'Status'] },
        ],
    },
);

Employee.hasMany(LeaveRequest, { foreignKey: 'employeeId', sourceKey: 'id', as: 'leaveRequests' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'approvedBy', targetKey: 'id', as: 'approver' });
LeaveType.hasMany(LeaveRequest, { foreignKey: 'leaveTypeId', sourceKey: 'id', as: 'requests' });
LeaveRequest.belongsTo(LeaveType, { foreignKey: 'leaveTypeId', targetKey: 'id', as: 'leaveType' });
