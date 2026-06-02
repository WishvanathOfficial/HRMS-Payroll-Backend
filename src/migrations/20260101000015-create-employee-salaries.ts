import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'EmployeeSalaries';

export const up = (queryInterface: QueryInterface, Sequelize: any) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.createTable(
            TABLE_NAME,
            {
                id: {
                    field: 'Id',
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                employeeId: {
                    field: 'EmployeeId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Employees', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                structureId: {
                    field: 'StructureId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'SalaryStructures', key: 'Id' },
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                },
                ctc: { field: 'Ctc', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                effectiveFrom: { field: 'EffectiveFrom', type: Sequelize.DATEONLY, allowNull: false },
                effectiveTo: { field: 'EffectiveTo', type: Sequelize.DATEONLY, allowNull: true },
                createdBy: { field: 'CreatedBy', type: Sequelize.STRING },
                createdOn: {
                    field: 'CreatedOn',
                    type: Sequelize.DATE(6),
                    defaultValue: literal('CURRENT_TIMESTAMP(6)'),
                    allowNull: false,
                },
                updatedBy: { field: 'UpdatedBy', type: Sequelize.STRING },
                updatedOn: {
                    field: 'UpdatedOn',
                    type: Sequelize.DATE(6),
                    defaultValue: literal('CURRENT_TIMESTAMP(6)'),
                    allowNull: false,
                },
            },
            { transaction },
        );
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
