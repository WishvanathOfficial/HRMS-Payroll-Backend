import { QueryInterface, literal, DataTypes } from 'sequelize';

const TABLE_NAME = 'JobPostings';

export const up = (queryInterface: QueryInterface, Sequelize: typeof DataTypes) =>
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
                designationId: {
                    field: 'DesignationId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Designations', key: 'Id' },
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                },
                departmentId: {
                    field: 'DepartmentId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Departments', key: 'Id' },
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                },
                openings: { field: 'Openings', type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('OPEN', 'CLOSED', 'ON_HOLD'),
                    allowNull: false,
                    defaultValue: 'OPEN',
                },
                postedOn: { field: 'PostedOn', type: Sequelize.DATEONLY, allowNull: false },
                closesOn: { field: 'ClosesOn', type: Sequelize.DATEONLY, allowNull: true },
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
        // Common filter: "open postings"
        try {
            await queryInterface.addIndex(TABLE_NAME, ['Status'], { transaction });
        } catch (err: unknown) {
            const code = (err as { original?: { code?: string } } | null | undefined)?.original?.code;
            if (code !== 'ER_DUP_KEYNAME') throw err;
        }
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
