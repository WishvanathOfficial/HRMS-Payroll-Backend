import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';
import { SalaryStructure } from './salary-structure';

export interface EmployeeSalaryAttributes {
    id: number;
    employeeId: number;
    structureId: number;
    ctc: number;
    effectiveFrom: string;
    effectiveTo: string | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmployeeSalaryCreationAttributes extends Optional<
    EmployeeSalaryAttributes,
    'id' | 'ctc' | 'effectiveTo' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const EmployeeSalary: ModelDefined<EmployeeSalaryAttributes, EmployeeSalaryCreationAttributes> =
    sequelize.define(
        'EmployeeSalary',
        {
            id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
            structureId: { field: 'StructureId', type: DataTypes.INTEGER, allowNull: false },
            ctc: { field: 'Ctc', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            effectiveFrom: { field: 'EffectiveFrom', type: DataTypes.DATEONLY, allowNull: false },
            effectiveTo: { field: 'EffectiveTo', type: DataTypes.DATEONLY, allowNull: true },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'EmployeeSalaries',
            timestamps: false,
        },
    );

Employee.hasMany(EmployeeSalary, { foreignKey: 'employeeId', sourceKey: 'id', as: 'salaries' });
EmployeeSalary.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
SalaryStructure.hasMany(EmployeeSalary, { foreignKey: 'structureId', sourceKey: 'id', as: 'employeeSalaries' });
EmployeeSalary.belongsTo(SalaryStructure, { foreignKey: 'structureId', targetKey: 'id', as: 'structure' });
