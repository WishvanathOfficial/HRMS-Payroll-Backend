import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'AppraisalCycles';

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
                startDate: { field: 'StartDate', type: Sequelize.DATEONLY, allowNull: false },
                endDate: { field: 'EndDate', type: Sequelize.DATEONLY, allowNull: false },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('UPCOMING', 'ACTIVE', 'CLOSED'),
                    allowNull: false,
                    defaultValue: 'UPCOMING',
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
        await queryInterface.addIndex(TABLE_NAME, ['Status'], { transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
