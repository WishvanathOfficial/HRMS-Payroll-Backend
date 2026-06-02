import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';
import { Shift } from './shift';

export interface EmployeeShiftAttributes {
    id: number;
    employeeId: number;
    shiftId: number;
    effectiveFrom: string;
    effectiveTo: string | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmployeeShiftCreationAttributes extends Optional<
    EmployeeShiftAttributes,
    'id' | 'effectiveTo' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const EmployeeShift: ModelDefined<EmployeeShiftAttributes, EmployeeShiftCreationAttributes> = sequelize.define(
    'EmployeeShift',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
        shiftId: { field: 'ShiftId', type: DataTypes.INTEGER, allowNull: false },
        effectiveFrom: { field: 'EffectiveFrom', type: DataTypes.DATEONLY, allowNull: false },
        effectiveTo: { field: 'EffectiveTo', type: DataTypes.DATEONLY, allowNull: true },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'EmployeeShifts',
        timestamps: false,
    },
);

Employee.hasMany(EmployeeShift, { foreignKey: 'employeeId', sourceKey: 'id', as: 'shifts' });
EmployeeShift.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
Shift.hasMany(EmployeeShift, { foreignKey: 'shiftId', sourceKey: 'id', as: 'employeeShifts' });
EmployeeShift.belongsTo(Shift, { foreignKey: 'shiftId', targetKey: 'id', as: 'shift' });
