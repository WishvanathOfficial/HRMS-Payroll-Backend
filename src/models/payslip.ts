import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { PayrollRun } from './payroll-run';
import { Employee } from './employee';

export type PayslipStatus = 'DRAFT' | 'GENERATED' | 'PAID' | 'CANCELLED';

export interface PayslipAttributes {
    id: number;
    payrollRunId: number;
    employeeId: number;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    paidDays: number;
    lopDays: number;
    status: PayslipStatus;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PayslipCreationAttributes extends Optional<
    PayslipAttributes,
    | 'id'
    | 'grossSalary'
    | 'totalDeductions'
    | 'netSalary'
    | 'paidDays'
    | 'lopDays'
    | 'status'
    | 'createdBy'
    | 'createdOn'
    | 'updatedBy'
    | 'updatedOn'
> {}

export const Payslip: ModelDefined<PayslipAttributes, PayslipCreationAttributes> = sequelize.define(
    'Payslip',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        payrollRunId: { field: 'PayrollRunId', type: DataTypes.INTEGER, allowNull: false },
        employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
        grossSalary: { field: 'GrossSalary', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        totalDeductions: { field: 'TotalDeductions', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        netSalary: { field: 'NetSalary', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        paidDays: { field: 'PaidDays', type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        lopDays: { field: 'LopDays', type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        status: {
            field: 'Status',
            type: DataTypes.ENUM('DRAFT', 'GENERATED', 'PAID', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'DRAFT',
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'Payslips',
        timestamps: false,
        indexes: [
            // One payslip per employee per payroll run
            { unique: true, fields: ['PayrollRunId', 'EmployeeId'] },
        ],
    },
);

PayrollRun.hasMany(Payslip, { foreignKey: 'payrollRunId', sourceKey: 'id', as: 'payslips' });
Payslip.belongsTo(PayrollRun, { foreignKey: 'payrollRunId', targetKey: 'id', as: 'payrollRun' });
Employee.hasMany(Payslip, { foreignKey: 'employeeId', sourceKey: 'id', as: 'payslips' });
Payslip.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
