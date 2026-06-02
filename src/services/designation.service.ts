import { Op } from 'sequelize';
import { Designation, Department } from '../models';
import { DesignationAttributes } from '../models/designation';
import { ApiError } from '../utils/ApiError';

export interface DesignationFilters {
    departmentId?: number;
    q?: string;
    limit: number;
    offset: number;
}

export const designationService = {
    async list(filters: DesignationFilters) {
        const where: Record<string, unknown> = {};
        if (filters.q) where.title = { [Op.like]: `%${filters.q}%` };
        if (filters.departmentId) where.departmentId = filters.departmentId;

        const { rows, count } = await Designation.findAndCountAll({
            where,
            order: [['id', 'ASC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await Designation.findByPk(id);
        if (!row) throw ApiError.notFound('Designation not found');
        return row;
    },

    async create(payload: Partial<DesignationAttributes>) {
        if (!payload.title) throw ApiError.badRequest('title is required');
        if (!payload.departmentId) throw ApiError.badRequest('departmentId is required');
        if (!(await Department.findByPk(payload.departmentId))) {
            throw ApiError.badRequest(`departmentId ${payload.departmentId} does not exist`);
        }
        return Designation.create(payload as never);
    },

    async update(id: number, payload: Partial<DesignationAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async listWithDepartment(filters: { limit: number; offset: number }) {
        return Designation.findAll({
            include: [{ association: 'department' }],
            order: [['id', 'ASC']],
            limit: filters.limit,
            offset: filters.offset,
        });
    },
};
