import { AppraisalCycle, EmployeeAppraisal } from '../models';
import { AppraisalCycleAttributes, AppraisalCycleStatus } from '../models/appraisal-cycle';
import { ApiError } from '../utils/ApiError';

export const appraisalCycleService = {
    async list(filters: { status?: AppraisalCycleStatus }) {
        const where: Record<string, unknown> = {};
        if (filters.status) where.status = filters.status;
        return AppraisalCycle.findAll({ where, order: [['startDate', 'DESC']] });
    },

    async getById(id: number) {
        const row = await AppraisalCycle.findByPk(id);
        if (!row) throw ApiError.notFound('Appraisal cycle not found');
        return row;
    },

    async create(payload: Partial<AppraisalCycleAttributes>) {
        if (!payload.name || !payload.startDate || !payload.endDate) {
            throw ApiError.badRequest('name, startDate and endDate are required');
        }
        if (await AppraisalCycle.findOne({ where: { name: payload.name } })) {
            throw ApiError.conflict(`Appraisal cycle "${payload.name}" already exists`);
        }
        return AppraisalCycle.create(payload as never);
    },

    async update(id: number, payload: Partial<AppraisalCycleAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async appraisals(id: number) {
        await this.getById(id);
        return EmployeeAppraisal.findAll({ where: { cycleId: id } });
    },
};
