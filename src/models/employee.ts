import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Department } from './department';
import { Designation } from './designation';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE';

export interface EmployeeAttributes {
    id: number;
    empCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    dob: string | null;
    gender: Gender | null;
    joinDate: string;
    departmentId: number | null;
    designationId: number | null;
    reportingTo: number | null;
    status: EmployeeStatus;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmployeeCreationAttributes extends Optional<
    EmployeeAttributes,
    | 'id'
    | 'phone'
    | 'dob'
    | 'gender'
    | 'departmentId'
    | 'designationId'
    | 'reportingTo'
    | 'status'
    | 'createdBy'
    | 'createdOn'
    | 'updatedBy'
    | 'updatedOn'
> {}

export const Employee: ModelDefined<EmployeeAttributes, EmployeeCreationAttributes> = sequelize.define(
    'Employee',
    {
        id: {
            field: 'Id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        empCode: {
            field: 'EmpCode',
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        firstName: { field: 'FirstName', type: DataTypes.STRING(80), allowNull: false },
        lastName: { field: 'LastName', type: DataTypes.STRING(80), allowNull: false },
        email: {
            field: 'Email',
            type: DataTypes.STRING(160),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        phone: { field: 'Phone', type: DataTypes.STRING(30), allowNull: true },
        dob: { field: 'Dob', type: DataTypes.DATEONLY, allowNull: true },
        gender: { field: 'Gender', type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: true },
        joinDate: { field: 'JoinDate', type: DataTypes.DATEONLY, allowNull: false },
        departmentId: { field: 'DepartmentId', type: DataTypes.INTEGER, allowNull: true },
        designationId: { field: 'DesignationId', type: DataTypes.INTEGER, allowNull: true },
        reportingTo: { field: 'ReportingTo', type: DataTypes.INTEGER, allowNull: true },
        status: {
            field: 'Status',
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE'),
            allowNull: false,
            defaultValue: 'ACTIVE',
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'Employees',
        timestamps: false,
        indexes: [
            // Status filter is common (active employees only)
            { fields: ['Status'] },
        ],
    },
);

// Department ↔ Employee
Department.hasMany(Employee, { foreignKey: 'departmentId', sourceKey: 'id', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'departmentId', targetKey: 'id', as: 'department' });

// Designation ↔ Employee
Designation.hasMany(Employee, { foreignKey: 'designationId', sourceKey: 'id', as: 'employees' });
Employee.belongsTo(Designation, { foreignKey: 'designationId', targetKey: 'id', as: 'designation' });

// Department.manager → Employee (the deferred FK side; constraints:false avoids re-adding it)
Department.belongsTo(Employee, { foreignKey: 'managerId', targetKey: 'id', as: 'manager', constraints: false });

// Self-referential manager / reportees
Employee.belongsTo(Employee, { foreignKey: 'reportingTo', targetKey: 'id', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'reportingTo', sourceKey: 'id', as: 'reportees' });
