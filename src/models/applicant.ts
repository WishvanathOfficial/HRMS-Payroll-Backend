import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { JobPosting } from './job-posting';

export type ApplicantStatus = 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'HIRED' | 'REJECTED';

export interface ApplicantAttributes {
    id: number;
    jobPostingId: number;
    name: string;
    email: string;
    phone: string | null;
    resumeUrl: string | null;
    status: ApplicantStatus;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ApplicantCreationAttributes extends Optional<
    ApplicantAttributes,
    'id' | 'phone' | 'resumeUrl' | 'status' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const Applicant: ModelDefined<ApplicantAttributes, ApplicantCreationAttributes> = sequelize.define(
    'Applicant',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        jobPostingId: { field: 'JobPostingId', type: DataTypes.INTEGER, allowNull: false },
        name: { field: 'Name', type: DataTypes.STRING(160), allowNull: false },
        email: { field: 'Email', type: DataTypes.STRING(160), allowNull: false, validate: { isEmail: true } },
        phone: { field: 'Phone', type: DataTypes.STRING(30), allowNull: true },
        resumeUrl: { field: 'ResumeUrl', type: DataTypes.STRING(500), allowNull: true },
        status: {
            field: 'Status',
            type: DataTypes.ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'),
            allowNull: false,
            defaultValue: 'APPLIED',
        },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'Applicants',
        timestamps: false,
        indexes: [
            // Drives "applicants for posting X in status Y" pipeline view
            { fields: ['JobPostingId', 'Status'] },
        ],
    },
);

JobPosting.hasMany(Applicant, { foreignKey: 'jobPostingId', sourceKey: 'id', as: 'applicants' });
Applicant.belongsTo(JobPosting, { foreignKey: 'jobPostingId', targetKey: 'id', as: 'jobPosting' });
