import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';

export type ComponentType = 'EARNING' | 'DEDUCTION';
export type CalcType = 'FIXED' | 'PERCENTAGE';

export interface SalaryComponentAttributes {
    id: number;
    name: string;
    type: ComponentType;
    calcType: CalcType;
    value: number;
    taxable: boolean;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SalaryComponentCreationAttributes extends Optional<
    SalaryComponentAttributes,
    'id' | 'calcType' | 'value' | 'taxable' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const SalaryComponent: ModelDefined<SalaryComponentAttributes, SalaryComponentCreationAttributes> =
    sequelize.define(
        'SalaryComponent',
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
            type: {
                field: 'Type',
                type: DataTypes.ENUM('EARNING', 'DEDUCTION'),
                allowNull: false,
            },
            calcType: {
                field: 'CalcType',
                type: DataTypes.ENUM('FIXED', 'PERCENTAGE'),
                allowNull: false,
                defaultValue: 'FIXED',
            },
            value: {
                field: 'Value',
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            taxable: {
                field: 'Taxable',
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'SalaryComponents',
            timestamps: false,
        },
    );
