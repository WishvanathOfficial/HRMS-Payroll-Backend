import { QueryInterface, literal } from 'sequelize';

const TABLE_NAME = 'Applicants';

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
                jobPostingId: {
                    field: 'JobPostingId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'JobPostings', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                name: { field: 'Name', type: Sequelize.STRING(160), allowNull: false },
                email: { field: 'Email', type: Sequelize.STRING(160), allowNull: false },
                phone: { field: 'Phone', type: Sequelize.STRING(30), allowNull: true },
                resumeUrl: { field: 'ResumeUrl', type: Sequelize.STRING(500), allowNull: true },
                status: {
                    field: 'Status',
                    type: Sequelize.ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'),
                    allowNull: false,
                    defaultValue: 'APPLIED',
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
        // Drives "applicants in posting X with status Y" pipeline view
        try {
            await queryInterface.addIndex(TABLE_NAME, ['JobPostingId', 'Status'], { transaction });
        } catch (err: any) {
            if (err.original?.code !== 'ER_DUP_KEYNAME') throw err;
        }
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.dropTable({ tableName: TABLE_NAME }, { transaction });
    });
