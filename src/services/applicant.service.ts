import { Op } from 'sequelize';
import { Applicant, JobPosting } from '../models';
import { ApplicantAttributes, ApplicantStatus } from '../models/applicant';
import { ApiError } from '../utils/ApiError';

export const applicantService = {
    async list(filters: {
        jobPostingId?: number;
        status?: ApplicantStatus;
        q?: string;
        limit: number;
        offset: number;
    }) {
        const where: Record<string, unknown> = {};
        if (filters.jobPostingId) where.jobPostingId = filters.jobPostingId;
        if (filters.status) where.status = filters.status;
        if (filters.q) {
            where[Op.or as unknown as string] = [
                { name: { [Op.like]: `%${filters.q}%` } },
                { email: { [Op.like]: `%${filters.q}%` } },
            ];
        }
        const { rows, count } = await Applicant.findAndCountAll({
            where,
            order: [['id', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await Applicant.findByPk(id);
        if (!row) throw ApiError.notFound('Applicant not found');
        return row;
    },

    async create(payload: Partial<ApplicantAttributes>) {
        if (!payload.name || !payload.email || !payload.jobPostingId) {
            throw ApiError.badRequest('name, email and jobPostingId are required');
        }
        if (!(await JobPosting.findByPk(payload.jobPostingId))) {
            throw ApiError.badRequest(`jobPostingId ${payload.jobPostingId} does not exist`);
        }
        return Applicant.create(payload as never);
    },

    async update(id: number, payload: Partial<ApplicantAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async changeStatus(id: number, status: ApplicantStatus) {
        if (!status) throw ApiError.badRequest('status is required');
        const row = await this.getById(id);
        await row.update({ status } as never);
        return row;
    },
};
