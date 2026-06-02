import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';
import { Department } from './department';
import { Designation } from './designation';

export interface EmploymentHistoryAttributes {
    id: number;
    employeeId: number;
    departmentId: number | null;
    designationId: number | null;
    effectiveFrom: string;
    effectiveTo: string | null;
    reason: string | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmploymentHistoryCreationAttributes extends Optional<
    EmploymentHistoryAttributes,
    | 'id'
    | 'departmentId'
    | 'designationId'
    | 'effectiveTo'
    | 'reason'
    | 'createdBy'
    | 'createdOn'
    | 'updatedBy'
    | 'updatedOn'
> {}

export const EmploymentHistory: ModelDefined<EmploymentHistoryAttributes, EmploymentHistoryCreationAttributes> =
    sequelize.define(
        'EmploymentHistory',
        {
            id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
            departmentId: { field: 'DepartmentId', type: DataTypes.INTEGER, allowNull: true },
            designationId: { field: 'DesignationId', type: DataTypes.INTEGER, allowNull: true },
            effectiveFrom: { field: 'EffectiveFrom', type: DataTypes.DATEONLY, allowNull: false },
            effectiveTo: { field: 'EffectiveTo', type: DataTypes.DATEONLY, allowNull: true },
            reason: { field: 'Reason', type: DataTypes.STRING(255), allowNull: true },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'EmploymentHistory',
            timestamps: false,
        },
    );

Employee.hasMany(EmploymentHistory, { foreignKey: 'employeeId', sourceKey: 'id', as: 'employmentHistory' });
EmploymentHistory.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
EmploymentHistory.belongsTo(Department, { foreignKey: 'departmentId', targetKey: 'id', as: 'department' });
EmploymentHistory.belongsTo(Designation, { foreignKey: 'designationId', targetKey: 'id', as: 'designation' });
