import { QueryInterface, literal, DataTypes } from 'sequelize';

const TABLE_NAME = 'InterviewStages';

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
                applicantId: {
                    field: 'ApplicantId',
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Applicants', key: 'Id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                stage: { field: 'Stage', type: Sequelize.STRING(80), allowNull: false },
                scheduledOn: { field: 'ScheduledOn', type: Sequelize.DATEONLY, allowNull: true },
                interviewerId: {
                    field: 'InterviewerId',
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: 'Employees', key: 'Id' },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE',
                },
                result: {
                    field: 'Result',
                    type: Sequelize.ENUM('PENDING', 'PASSED', 'FAILED', 'ON_HOLD'),
                    allowNull: false,
                    defaultValue: 'PENDING',
                },
                feedback: { field: 'Feedback', type: Sequelize.STRING(1000), allowNull: true },
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
