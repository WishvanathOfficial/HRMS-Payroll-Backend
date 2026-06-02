import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Department } from './department';

export interface DesignationAttributes {
    id: number;
    title: string;
    grade: string | null;
    departmentId: number;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DesignationCreationAttributes extends Optional<
    DesignationAttributes,
    'id' | 'grade' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const Designation: ModelDefined<DesignationAttributes, DesignationCreationAttributes> = sequelize.define(
    'Designation',
    {
        id: {
            field: 'Id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            field: 'Title',
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        grade: {
            field: 'Grade',
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        departmentId: {
            field: 'DepartmentId',
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'Designations',
        timestamps: false,
        indexes: [
            // Enforces "title unique per department"
            { unique: true, fields: ['Title', 'DepartmentId'] },
        ],
    },
);

Department.hasMany(Designation, { foreignKey: 'departmentId', sourceKey: 'id', as: 'designations' });
Designation.belongsTo(Department, { foreignKey: 'departmentId', targetKey: 'id', as: 'department' });
