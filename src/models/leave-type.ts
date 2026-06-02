import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';

export interface LeaveTypeAttributes {
    id: number;
    name: string;
    daysAllowed: number;
    isPaid: boolean;
    carryForward: boolean;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LeaveTypeCreationAttributes extends Optional<
    LeaveTypeAttributes,
    'id' | 'daysAllowed' | 'isPaid' | 'carryForward' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const LeaveType: ModelDefined<LeaveTypeAttributes, LeaveTypeCreationAttributes> = sequelize.define(
    'LeaveType',
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
            type: DataTypes.STRING(80),
            allowNull: false,
            unique: true,
        },
        daysAllowed: {
            field: 'DaysAllowed',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isPaid: {
            field: 'IsPaid',
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        carryForward: {
            field: 'CarryForward',
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'LeaveTypes',
        timestamps: false,
    },
);
