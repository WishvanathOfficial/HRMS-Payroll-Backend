import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'Departments';

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
                name: { field: 'Name', type: Sequelize.STRING(120), allowNull: false, unique: true },
                parentDeptId: {
                    field: 'ParentDeptId',
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: TABLE_NAME, key: 'Id' },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                },
                // ManagerId FK -> Employees.Id is added later (migration 24) to break the circular dependency.
                managerId: { field: 'ManagerId', type: Sequelize.INTEGER, allowNull: true },
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
