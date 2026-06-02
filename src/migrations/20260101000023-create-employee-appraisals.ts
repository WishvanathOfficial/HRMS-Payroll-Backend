import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'EmployeeAppraisals';

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
                cycleId: {
                    field: 'CycleId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'AppraisalCycles', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                employeeId: {
                    field: 'EmployeeId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Employees', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                selfRating: { field: 'SelfRating', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                managerRating: {
                    field: 'ManagerRating',
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
                finalRating: { field: 'FinalRating', type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
                comments: { field: 'Comments', type: Sequelize.STRING(1000), allowNull: true },
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
        // One appraisal per (cycle, employee)
        await queryInterface.addIndex(TABLE_NAME, ['CycleId', 'EmployeeId'], { unique: true, transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
