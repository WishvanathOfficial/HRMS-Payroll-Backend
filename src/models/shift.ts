import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';

export interface ShiftAttributes {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    weeklyOffDay: number;
    overtimeMultiplier: number;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ShiftCreationAttributes extends Optional<
    ShiftAttributes,
    'id' | 'weeklyOffDay' | 'overtimeMultiplier' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const Shift: ModelDefined<ShiftAttributes, ShiftCreationAttributes> = sequelize.define(
    'Shift',
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
        startTime: {
            field: 'StartTime',
            type: DataTypes.TIME,
            allowNull: false,
        },
        endTime: {
            field: 'EndTime',
            type: DataTypes.TIME,
            allowNull: false,
        },
        weeklyOffDay: {
            field: 'WeeklyOffDay',
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
        },
        overtimeMultiplier: {
            field: 'OvertimeMultiplier',
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1.0,
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: {
            field: 'CreatedOn',
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: {
            field: 'UpdatedOn',
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        tableName: 'Shifts',
        timestamps: false,
    },
);
