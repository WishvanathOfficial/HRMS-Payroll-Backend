import { LeaveBalance } from '../models';
import { LeaveBalanceAttributes } from '../models/leave-balance';
import { ApiError } from '../utils/ApiError';

export const leaveBalanceService = {
    async list(filters: { employeeId?: number; year?: number; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.employeeId) where.employeeId = filters.employeeId;
        if (filters.year) where.year = filters.year;
        const { rows, count } = await LeaveBalance.findAndCountAll({
            where,
            order: [['id', 'ASC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await LeaveBalance.findByPk(id);
        if (!row) throw ApiError.notFound('Leave balance not found');
        return row;
    },

    async create(payload: Partial<LeaveBalanceAttributes>) {
        if (!payload.employeeId || !payload.leaveTypeId || !payload.year) {
            throw ApiError.badRequest('employeeId, leaveTypeId and year are required');
        }
        const allocated = Number(payload.allocated ?? 0);
        const used = Number(payload.used ?? 0);
        return LeaveBalance.create({ ...payload, allocated, used, balance: allocated - used } as never);
    },

    async update(id: number, payload: Partial<LeaveBalanceAttributes>) {
        const row = await this.getById(id);
        const allocated = Number(payload.allocated ?? row.get('allocated'));
        const used = Number(payload.used ?? row.get('used'));
        await row.update({ ...payload, allocated, used, balance: allocated - used } as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async byEmployee(employeeId: number, year: number) {
        return LeaveBalance.findAll({ where: { employeeId, year } });
    },
};
