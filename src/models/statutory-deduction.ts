import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Payslip } from './payslip';

export type StatutoryType = 'PF' | 'ESI' | 'PT' | 'TDS' | 'OTHER';

export interface StatutoryDeductionAttributes {
    id: number;
    payslipId: number;
    type: StatutoryType;
    employeeShare: number;
    employerShare: number;
    taxableIncome: number;
    tdsAmount: number;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StatutoryDeductionCreationAttributes extends Optional<
    StatutoryDeductionAttributes,
    | 'id'
    | 'employeeShare'
    | 'employerShare'
    | 'taxableIncome'
    | 'tdsAmount'
    | 'createdBy'
    | 'createdOn'
    | 'updatedBy'
    | 'updatedOn'
> {}

export const StatutoryDeduction: ModelDefined<StatutoryDeductionAttributes, StatutoryDeductionCreationAttributes> =
    sequelize.define(
        'StatutoryDeduction',
        {
            id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            payslipId: { field: 'PayslipId', type: DataTypes.INTEGER, allowNull: false },
            type: { field: 'Type', type: DataTypes.ENUM('PF', 'ESI', 'PT', 'TDS', 'OTHER'), allowNull: false },
            employeeShare: { field: 'EmployeeShare', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            employerShare: { field: 'EmployerShare', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            taxableIncome: { field: 'TaxableIncome', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            tdsAmount: { field: 'TdsAmount', type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'StatutoryDeductions',
            timestamps: false,
        },
    );

Payslip.hasMany(StatutoryDeduction, { foreignKey: 'payslipId', sourceKey: 'id', as: 'statutoryDeductions' });
StatutoryDeduction.belongsTo(Payslip, { foreignKey: 'payslipId', targetKey: 'id', as: 'payslip' });
