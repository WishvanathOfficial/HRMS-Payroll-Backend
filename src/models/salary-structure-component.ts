import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { SalaryStructure } from './salary-structure';
import { SalaryComponent } from './salary-component';

export interface SalaryStructureComponentAttributes {
    id: number;
    structureId: number;
    componentId: number;
    amount: number;
    percentage: number;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SalaryStructureComponentCreationAttributes extends Optional<
    SalaryStructureComponentAttributes,
    'id' | 'amount' | 'percentage' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const SalaryStructureComponent: ModelDefined<
    SalaryStructureComponentAttributes,
    SalaryStructureComponentCreationAttributes
> = sequelize.define(
    'SalaryStructureComponent',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        structureId: { field: 'StructureId', type: DataTypes.INTEGER, allowNull: false },
        componentId: { field: 'ComponentId', type: DataTypes.INTEGER, allowNull: false },
        amount: { field: 'Amount', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        percentage: { field: 'Percentage', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'SalaryStructureComponents',
        timestamps: false,
        indexes: [
            // One mapping per (structure, component)
            { unique: true, fields: ['StructureId', 'ComponentId'] },
        ],
    },
);

SalaryStructure.hasMany(SalaryStructureComponent, { foreignKey: 'structureId', sourceKey: 'id', as: 'mappings' });
SalaryStructureComponent.belongsTo(SalaryStructure, { foreignKey: 'structureId', targetKey: 'id', as: 'structure' });
SalaryComponent.hasMany(SalaryStructureComponent, { foreignKey: 'componentId', sourceKey: 'id', as: 'mappings' });
SalaryStructureComponent.belongsTo(SalaryComponent, { foreignKey: 'componentId', targetKey: 'id', as: 'component' });

// Many-to-many helpers
SalaryStructure.belongsToMany(SalaryComponent, {
    through: SalaryStructureComponent,
    foreignKey: 'structureId',
    otherKey: 'componentId',
    as: 'components',
});
SalaryComponent.belongsToMany(SalaryStructure, {
    through: SalaryStructureComponent,
    foreignKey: 'componentId',
    otherKey: 'structureId',
    as: 'structures',
});
