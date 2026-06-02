import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Employee } from './employee';

export type PayrollRunStatus = 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'LOCKED';

export interface PayrollRunAttributes {
    id: number;
    month: number;
    year: number;
    status: PayrollRunStatus;
    processedAt: Date | null;
    processedBy: number | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PayrollRunCreationAttributes extends Optional<
    PayrollRunAttributes,
    'id' | 'status' | 'processedAt' | 'processedBy' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const PayrollRun: ModelDefined<PayrollRunAttributes, PayrollRunCreationAttributes> = sequelize.define(
    'PayrollRun',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        month: { field: 'Month', type: DataTypes.TINYINT, allowNull: false },
        year: { field: 'Year', type: DataTypes.SMALLINT, allowNull: false },
        status: {
            field: 'Status',
            type: DataTypes.ENUM('DRAFT', 'PROCESSING', 'COMPLETED', 'FAILED', 'LOCKED'),
            allowNull: false,
            defaultValue: 'DRAFT',
        },
        processedAt: { field: 'ProcessedAt', type: DataTypes.DATE, allowNull: true },
        processedBy: { field: 'ProcessedBy', type: DataTypes.INTEGER, allowNull: true },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'PayrollRuns',
        timestamps: false,
        indexes: [
            // Only one run can exist for a given month/year
            { unique: true, fields: ['Month', 'Year'] },
        ],
    },
);

PayrollRun.belongsTo(Employee, { foreignKey: 'processedBy', targetKey: 'id', as: 'processor' });
