import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';

export interface UserAttributes {
    id: number;
    employeeId: number | null;
    email: string;
    passwordHash: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCreationAttributes extends Optional<
    UserAttributes,
    'id' | 'employeeId' | 'isActive' | 'lastLoginAt' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define(
    'User',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        employeeId: { field: 'EmployeeId', type: DataTypes.INTEGER, allowNull: true, unique: true },
        email: {
            field: 'Email',
            type: DataTypes.STRING(160),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        passwordHash: { field: 'PasswordHash', type: DataTypes.STRING(255), allowNull: false },
        isActive: { field: 'IsActive', type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        lastLoginAt: { field: 'LastLoginAt', type: DataTypes.DATE, allowNull: true },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'Users',
        timestamps: false,
        // Never leak the hash on `JSON.stringify(userInstance)` / response
        defaultScope: {
            attributes: { exclude: ['passwordHash'] },
        },
        scopes: {
            withPassword: { attributes: { include: ['passwordHash'] } },
        },
        indexes: [{ fields: ['IsActive'] }],
    },
);

// One-to-one with Employee (every employee may have one login)
Employee.hasOne(User, { foreignKey: 'employeeId', sourceKey: 'id', as: 'userAccount' });
User.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
