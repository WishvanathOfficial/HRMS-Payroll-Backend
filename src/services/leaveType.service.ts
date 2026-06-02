import { LeaveType } from '../models';
import { LeaveTypeAttributes } from '../models/leave-type';
import { ApiError } from '../utils/ApiError';

export const leaveTypeService = {
    async list() {
        return LeaveType.findAll({ order: [['id', 'ASC']] });
    },

    async getById(id: number) {
        const row = await LeaveType.findByPk(id);
        if (!row) throw ApiError.notFound('Leave type not found');
        return row;
    },

    async create(payload: Partial<LeaveTypeAttributes>) {
        if (!payload.name) throw ApiError.badRequest('name is required');
        if (await LeaveType.findOne({ where: { name: payload.name } })) {
            throw ApiError.conflict(`Leave type "${payload.name}" already exists`);
        }
        return LeaveType.create(payload as never);
    },

    async update(id: number, payload: Partial<LeaveTypeAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },
};
