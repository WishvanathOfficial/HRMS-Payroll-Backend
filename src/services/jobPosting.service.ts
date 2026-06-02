import { JobPosting, Department, Designation, Applicant } from '../models';
import { JobPostingAttributes, JobPostingStatus } from '../models/job-posting';
import { ApiError } from '../utils/ApiError';

export const jobPostingService = {
    async list(filters: { status?: JobPostingStatus; departmentId?: number; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.status) where.status = filters.status;
        if (filters.departmentId) where.departmentId = filters.departmentId;
        const { rows, count } = await JobPosting.findAndCountAll({
            where,
            order: [['postedOn', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await JobPosting.findByPk(id);
        if (!row) throw ApiError.notFound('Job posting not found');
        return row;
    },

    async create(payload: Partial<JobPostingAttributes>) {
        if (!payload.designationId || !payload.departmentId || !payload.postedOn) {
            throw ApiError.badRequest('designationId, departmentId and postedOn are required');
        }
        if (!(await Department.findByPk(payload.departmentId))) {
            throw ApiError.badRequest(`departmentId ${payload.departmentId} does not exist`);
        }
        if (!(await Designation.findByPk(payload.designationId))) {
            throw ApiError.badRequest(`designationId ${payload.designationId} does not exist`);
        }
        return JobPosting.create(payload as never);
    },

    async update(id: number, payload: Partial<JobPostingAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async close(id: number) {
        const row = await this.getById(id);
        await row.update({ status: 'CLOSED' } as never);
        return row;
    },

    async applicants(id: number) {
        await this.getById(id);
        return Applicant.findAll({ where: { jobPostingId: id } });
    },

    async listWithRelations(filters: { status?: JobPostingStatus; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.status) where.status = filters.status;
        return JobPosting.findAll({
            where,
            include: [
                { association: 'department', attributes: ['id', 'name'] },
                { association: 'designation', attributes: ['id', 'title'] },
            ],
            order: [['postedOn', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
    },
};
