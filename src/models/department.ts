import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';

export interface DepartmentAttributes {
    id: number;
    name: string;
    parentDeptId: number | null;
    managerId: number | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DepartmentCreationAttributes extends Optional<
    DepartmentAttributes,
    'id' | 'parentDeptId' | 'managerId' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const Department: ModelDefined<DepartmentAttributes, DepartmentCreationAttributes> = sequelize.define(
    'Department',
    {
        id: {
            field: 'Id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            field: 'Name',
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true,
        },
        parentDeptId: {
            field: 'ParentDeptId',
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        managerId: {
            field: 'ManagerId',
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'Departments',
        timestamps: false,
    },
);

// Self-referential parent ↔ children
Department.belongsTo(Department, { as: 'parent', foreignKey: 'parentDeptId', targetKey: 'id' });
Department.hasMany(Department, { as: 'children', foreignKey: 'parentDeptId', sourceKey: 'id' });
