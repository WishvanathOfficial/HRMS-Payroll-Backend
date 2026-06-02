import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Payslip } from './payslip';
import { SalaryComponent, ComponentType } from './salary-component';

export interface PayslipDetailAttributes {
    id: number;
    payslipId: number;
    componentId: number;
    amount: number;
    componentType: ComponentType;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PayslipDetailCreationAttributes extends Optional<
    PayslipDetailAttributes,
    'id' | 'amount' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const PayslipDetail: ModelDefined<PayslipDetailAttributes, PayslipDetailCreationAttributes> = sequelize.define(
    'PayslipDetail',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        payslipId: { field: 'PayslipId', type: DataTypes.INTEGER, allowNull: false },
        componentId: { field: 'ComponentId', type: DataTypes.INTEGER, allowNull: false },
        amount: { field: 'Amount', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        componentType: { field: 'ComponentType', type: DataTypes.ENUM('EARNING', 'DEDUCTION'), allowNull: false },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'PayslipDetails',
        timestamps: false,
    },
);

Payslip.hasMany(PayslipDetail, { foreignKey: 'payslipId', sourceKey: 'id', as: 'details' });
PayslipDetail.belongsTo(Payslip, { foreignKey: 'payslipId', targetKey: 'id', as: 'payslip' });
SalaryComponent.hasMany(PayslipDetail, { foreignKey: 'componentId', sourceKey: 'id', as: 'payslipDetails' });
PayslipDetail.belongsTo(SalaryComponent, { foreignKey: 'componentId', targetKey: 'id', as: 'component' });
