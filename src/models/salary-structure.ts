import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';

export interface SalaryStructureAttributes {
    id: number;
    name: string;
    description: string | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SalaryStructureCreationAttributes extends Optional<
    SalaryStructureAttributes,
    'id' | 'description' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const SalaryStructure: ModelDefined<SalaryStructureAttributes, SalaryStructureCreationAttributes> =
    sequelize.define(
        'SalaryStructure',
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
            description: {
                field: 'Description',
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'SalaryStructures',
            timestamps: false,
        },
    );
