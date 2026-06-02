import { DataTypes, Optional, ModelDefined } from 'sequelize';
import { sequelize } from '.';
import { Department } from './department';
import { Designation } from './designation';

export type JobPostingStatus = 'OPEN' | 'CLOSED' | 'ON_HOLD';

export interface JobPostingAttributes {
    id: number;
    designationId: number;
    departmentId: number;
    openings: number;
    status: JobPostingStatus;
    postedOn: string;
    closesOn: string | null;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JobPostingCreationAttributes extends Optional<
    JobPostingAttributes,
    'id' | 'openings' | 'status' | 'closesOn' | 'createdBy' | 'createdOn' | 'updatedBy' | 'updatedOn'
> {}

export const JobPosting: ModelDefined<JobPostingAttributes, JobPostingCreationAttributes> = sequelize.define(
    'JobPosting',
    {
        id: { field: 'Id', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        designationId: { field: 'DesignationId', type: DataTypes.INTEGER, allowNull: false },
        departmentId: { field: 'DepartmentId', type: DataTypes.INTEGER, allowNull: false },
        openings: { field: 'Openings', type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        status: {
            field: 'Status',
            type: DataTypes.ENUM('OPEN', 'CLOSED', 'ON_HOLD'),
            allowNull: false,
            defaultValue: 'OPEN',
        },
        postedOn: { field: 'PostedOn', type: DataTypes.DATEONLY, allowNull: false },
        closesOn: { field: 'ClosesOn', type: DataTypes.DATEONLY, allowNull: true },
        createdBy: { field: 'CreatedBy', type: DataTypes.STRING },
        createdOn: { field: 'CreatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updatedBy: { field: 'UpdatedBy', type: DataTypes.STRING },
        updatedOn: { field: 'UpdatedOn', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    },
    {
        tableName: 'JobPostings',
        timestamps: false,
        indexes: [
            // Common filter: "open postings"
            { fields: ['Status'] },
        ],
    },
);

Department.hasMany(JobPosting, { foreignKey: 'departmentId', sourceKey: 'id', as: 'jobPostings' });
JobPosting.belongsTo(Department, { foreignKey: 'departmentId', targetKey: 'id', as: 'department' });
Designation.hasMany(JobPosting, { foreignKey: 'designationId', sourceKey: 'id', as: 'jobPostings' });
JobPosting.belongsTo(Designation, { foreignKey: 'designationId', targetKey: 'id', as: 'designation' });
