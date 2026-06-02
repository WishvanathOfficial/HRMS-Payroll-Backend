import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'Designations';

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
                title: { field: 'Title', type: Sequelize.STRING(120), allowNull: false },
                grade: { field: 'Grade', type: Sequelize.STRING(30), allowNull: true },
                departmentId: {
                    field: 'DepartmentId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Departments', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
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
        // Enforces unique title within a department
        await queryInterface.addIndex(TABLE_NAME, ['Title', 'DepartmentId'], { unique: true, transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
