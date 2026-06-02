import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';

export type AppraisalCycleStatus = 'UPCOMING' | 'ACTIVE' | 'CLOSED';

export interface AppraisalCycleAttributes {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: AppraisalCycleStatus;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppraisalCycleCreationAttributes extends Optional<
    AppraisalCycleAttributes,
    'id' | 'status' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const AppraisalCycle: ModelDefined<AppraisalCycleAttributes, AppraisalCycleCreationAttributes> =
    sequelize.define(
        'AppraisalCycle',
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
            startDate: {
                field: 'StartDate',
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            endDate: {
                field: 'EndDate',
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            status: {
                field: 'Status',
                type: DataTypes.ENUM('UPCOMING', 'ACTIVE', 'CLOSED'),
                allowNull: false,
                defaultValue: 'UPCOMING',
            },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'AppraisalCycles',
            timestamps: false,
            indexes: [
                // Status is frequently filtered for "active" cycle lookups
                { fields: ['Status'] },
            ],
        },
    );
