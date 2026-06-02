import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { User } from './user';
import { Role } from './role';

export interface UserRoleAttributes {
    id: number;
    userId: number;
    roleId: number;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserRoleCreationAttributes extends Optional<
    UserRoleAttributes,
    'id' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const UserRole: ModelDefined<UserRoleAttributes, UserRoleCreationAttributes> = sequelize.define(
    'UserRole',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        userId: { field: 'UserId', type: DataTypes.INTEGER, allowNull: false },
        roleId: { field: 'RoleId', type: DataTypes.INTEGER, allowNull: false },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'UserRoles',
        timestamps: false,
        indexes: [{ unique: true, fields: ['UserId', 'RoleId'] }],
    },
);

// Many-to-many: User <-> Role through UserRole
User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles',
});
Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users',
});

UserRole.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
UserRole.belongsTo(Role, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
