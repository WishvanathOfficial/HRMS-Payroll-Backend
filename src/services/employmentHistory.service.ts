import { EmploymentHistory, Employee } from '../models';
import { EmploymentHistoryAttributes } from '../models/employment-history';
import { ApiError } from '../utils/ApiError';

export const employmentHistoryService = {
    async list(filters: { employeeId?: number; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.employeeId) where.employeeId = filters.employeeId;
        const { rows, count } = await EmploymentHistory.findAndCountAll({
            where,
            order: [['effectiveFrom', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await EmploymentHistory.findByPk(id);
        if (!row) throw ApiError.notFound('Employment history not found');
        return row;
    },

    async create(payload: Partial<EmploymentHistoryAttributes>) {
        if (!payload.employeeId) throw ApiError.badRequest('employeeId is required');
        if (!payload.effectiveFrom) throw ApiError.badRequest('effectiveFrom is required');
        if (!(await Employee.findByPk(payload.employeeId))) {
            throw ApiError.badRequest(`employeeId ${payload.employeeId} does not exist`);
        }
        return EmploymentHistory.create(payload as never);
    },

    async update(id: number, payload: Partial<EmploymentHistoryAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async byEmployee(employeeId: number) {
        return EmploymentHistory.findAll({ where: { employeeId }, order: [['effectiveFrom', 'DESC']] });
    },
};
