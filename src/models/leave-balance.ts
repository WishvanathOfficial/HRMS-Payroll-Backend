import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';
import { LeaveType } from './leave-type';

export interface LeaveBalanceAttributes {
    id: number;
    employeeId: number;
    leaveTypeId: number;
    year: number;
    allocated: number;
    used: number;
    balance: number;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LeaveBalanceCreationAttributes extends Optional<
    LeaveBalanceAttributes,
    'id' | 'allocated' | 'used' | 'balance' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const LeaveBalance: ModelDefined<LeaveBalanceAttributes, LeaveBalanceCreationAttributes> = sequelize.define(
    'LeaveBalance',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
        leaveTypeId: { field: 'LeaveTypeId', type: DataTypes.INTEGER, allowNull: false },
        year: { field: 'Year', type: DataTypes.INTEGER, allowNull: false },
        allocated: { field: 'Allocated', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        used: { field: 'Used', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        balance: { field: 'Balance', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'LeaveBalances',
        timestamps: false,
        indexes: [
            // One balance row per employee per leave type per year
            { unique: true, fields: ['EmployeeId', 'LeaveTypeId', 'Year'] },
        ],
    },
);

Employee.hasMany(LeaveBalance, { foreignKey: 'employeeId', sourceKey: 'id', as: 'leaveBalances' });
LeaveBalance.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
LeaveType.hasMany(LeaveBalance, { foreignKey: 'leaveTypeId', sourceKey: 'id', as: 'balances' });
LeaveBalance.belongsTo(LeaveType, { foreignKey: 'leaveTypeId', targetKey: 'id', as: 'leaveType' });
