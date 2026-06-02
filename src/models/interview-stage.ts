import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Applicant } from './applicant';
import { Employee } from './employee';

export type InterviewResult = 'PENDING' | 'PASSED' | 'FAILED' | 'ON_HOLD';

export interface InterviewStageAttributes {
    id: number;
    applicantId: number;
    stage: string;
    scheduledOn: string | null;
    interviewerId: number | null;
    result: InterviewResult;
    feedback: string | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InterviewStageCreationAttributes extends Optional<
    InterviewStageAttributes,
    | 'id'
    | 'scheduledOn'
    | 'interviewerId'
    | 'result'
    | 'feedback'
    | 'createdBy'
    | 'createdOn'
    | 'updatedBy'
    | 'updatedOn'
> {}

export const InterviewStage: ModelDefined<InterviewStageAttributes, InterviewStageCreationAttributes> =
    sequelize.define(
        'InterviewStage',
        {
            id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            applicantId: { field: 'ApplicantId', type: DataTypes.INTEGER, allowNull: false },
            stage: { field: 'Stage', type: DataTypes.STRING(80), allowNull: false },
            scheduledOn: { field: 'ScheduledOn', type: DataTypes.DATEONLY, allowNull: true },
            interviewerId: { field: 'InterviewerId', type: DataTypes.INTEGER, allowNull: true },
            result: {
                field: 'Result',
                type: DataTypes.ENUM('PENDING', 'PASSED', 'FAILED', 'ON_HOLD'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            feedback: { field: 'Feedback', type: DataTypes.STRING(1000), allowNull: true },
            createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
            createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
            updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
            updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        },
        {
            tableName: 'InterviewStages',
            timestamps: false,
        },
    );

Applicant.hasMany(InterviewStage, { foreignKey: 'applicantId', sourceKey: 'id', as: 'interviewStages' });
InterviewStage.belongsTo(Applicant, { foreignKey: 'applicantId', targetKey: 'id', as: 'applicant' });
InterviewStage.belongsTo(Employee, { foreignKey: 'interviewerId', targetKey: 'id', as: 'interviewer' });
