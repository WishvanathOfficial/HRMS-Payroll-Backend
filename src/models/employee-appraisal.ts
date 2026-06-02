import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { AppraisalCycle } from './appraisal-cycle';
import { Employee } from './employee';

export interface EmployeeAppraisalAttributes {
    id: number;
    cycleId: number;
    employeeId: number;
    selfRating: number;
    managerRating: number;
    finalRating: number;
    comments: string | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmployeeAppraisalCreationAttributes extends Optional<
    EmployeeAppraisalAttributes,
    | 'id'
    | 'selfRating'
    | 'managerRating'
    | 'finalRating'
    | 'comments'
    | 'createdBy'
    | 'createdOn'
    | 'updatedBy'
    | 'updatedOn'
> {}

export const EmployeeAppraisal: ModelDefined<EmployeeAppraisalAttributes, EmployeeAppraisalCreationAttributes> =
    sequelize.define(
        'EmployeeAppraisal',
        {
            id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            cycleId: { field: 'CycleId', type: DataTypes.INTEGER, allowNull: false },
            employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: false },
            selfRating: { field: 'SelfRating', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            managerRating: { field: 'ManagerRating', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            finalRating: { field: 'FinalRating', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            comments: { field: 'Comments', type: DataTypes.STRING(1000), allowNull: true },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'EmployeeAppraisals',
            timestamps: false,
            indexes: [
                // One appraisal per employee per cycle
                { unique: true, fields: ['CycleId', 'EmployeeId'] },
            ],
        },
    );

AppraisalCycle.hasMany(EmployeeAppraisal, { foreignKey: 'cycleId', sourceKey: 'id', as: 'appraisals' });
EmployeeAppraisal.belongsTo(AppraisalCycle, { foreignKey: 'cycleId', targetKey: 'id', as: 'cycle' });
Employee.hasMany(EmployeeAppraisal, { foreignKey: 'employeeId', sourceKey: 'id', as: 'appraisals' });
EmployeeAppraisal.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
