import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'Employees';

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
                empCode: { field: 'EmpCode', type: Sequelize.STRING(30), allowNull: false, unique: true },
                firstName: { field: 'FirstName', type: Sequelize.STRING(80), allowNull: false },
                lastName: { field: 'LastName', type: Sequelize.STRING(80), allowNull: false },
                email: { field: 'Email', type: Sequelize.STRING(160), allowNull: false, unique: true },
                phone: { field: 'Phone', type: Sequelize.STRING(30), allowNull: true },
                dob: { field: 'Dob', type: Sequelize.DATEONLY, allowNull: true },
                gender: { field: 'Gender', type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: true },
                joinDate: { field: 'JoinDate', type: Sequelize.DATEONLY, allowNull: false },
                departmentId: {
                    field: 'DepartmentId',
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: 'Departments', key: 'Id' },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                },
                designationId: {
                    field: 'DesignationId',
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: 'Designations', key: 'Id' },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                },
                reportingTo: {
                    field: 'ReportingTo',
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: TABLE_NAME, key: 'Id' },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE'),
                    allowNull: false,
                    defaultValue: 'ACTIVE',
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
        // Frequently filtered for "active employees only" dashboards
        await queryInterface.addIndex(TABLE_NAME, ['Status'], { transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
