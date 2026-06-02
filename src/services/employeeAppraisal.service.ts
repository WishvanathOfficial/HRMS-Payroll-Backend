import { EmployeeAppraisal, AppraisalCycle, Employee } from '../models';
import { EmployeeAppraisalAttributes } from '../models/employee-appraisal';
import { ApiError } from '../utils/ApiError';

export const employeeAppraisalService = {
    async list(filters: { cycleId?: number; employeeId?: number; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.cycleId) where.cycleId = filters.cycleId;
        if (filters.employeeId) where.employeeId = filters.employeeId;
        const { rows, count } = await EmployeeAppraisal.findAndCountAll({
            where,
            order: [['id', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await EmployeeAppraisal.findByPk(id);
        if (!row) throw ApiError.notFound('Employee appraisal not found');
        return row;
    },

    async create(payload: Partial<EmployeeAppraisalAttributes>) {
        if (!payload.cycleId || !payload.employeeId) {
            throw ApiError.badRequest('cycleId and employeeId are required');
        }
        if (!(await AppraisalCycle.findByPk(payload.cycleId))) {
            throw ApiError.badRequest(`cycleId ${payload.cycleId} does not exist`);
        }
        if (!(await Employee.findByPk(payload.employeeId))) {
            throw ApiError.badRequest(`employeeId ${payload.employeeId} does not exist`);
        }
        return EmployeeAppraisal.create(payload as never);
    },

    async update(id: number, payload: Partial<EmployeeAppraisalAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async finalize(id: number, finalRating: number) {
        if (Number.isNaN(finalRating)) throw ApiError.badRequest('finalRating must be a number');
        const row = await this.getById(id);
        await row.update({ finalRating } as never);
        return row;
    },
};
