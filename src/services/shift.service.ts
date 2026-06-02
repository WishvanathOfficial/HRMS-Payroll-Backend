import { Shift } from '../models';
import { ShiftAttributes } from '../models/shift';
import { ApiError } from '../utils/ApiError';

export const shiftService = {
    async list(filters: { limit: number; offset: number }) {
        const { rows, count } = await Shift.findAndCountAll({
            order: [['id', 'ASC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await Shift.findByPk(id);
        if (!row) throw ApiError.notFound('Shift not found');
        return row;
    },

    async create(payload: Partial<ShiftAttributes>) {
        if (!payload.name || !payload.startTime || !payload.endTime) {
            throw ApiError.badRequest('name, startTime and endTime are required');
        }
        return Shift.create(payload as never);
    },

    async update(id: number, payload: Partial<ShiftAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },
};
