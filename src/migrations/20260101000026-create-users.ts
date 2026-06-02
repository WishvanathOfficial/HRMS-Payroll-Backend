import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'Users';

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
                /**
                 * One-to-one link to Employees.Id. Nullable so we can have
                 * system / portal-admin users that are not on the payroll.
                 */
                employeeId: {
                    field: 'EmployeeId',
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    unique: true,
                    references: { model: 'Employees', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                email: { field: 'Email', type: Sequelize.STRING(160), allowNull: false, unique: true },
                passwordHash: { field: 'PasswordHash', type: Sequelize.STRING(255), allowNull: false },
                isActive: { field: 'IsActive', type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
                lastLoginAt: { field: 'LastLoginAt', type: Sequelize.DATE, allowNull: true },
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
        // Login lookups happen by email; the unique constraint already indexes it,
        // but we also want a fast filter for "active users" on the login path.
        await queryInterface.addIndex(TABLE_NAME, ['IsActive'], { transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
