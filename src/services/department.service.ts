import { Op } from 'sequelize';
import { Department, Designation, Employee } from '../models';
import { DepartmentAttributes } from '../models/department';
import { ApiError } from '../utils/ApiError';
import { Messages } from '../constants';

export interface DepartmentFilters {
    q?: string;
    parentDeptId?: number | null;
    limit: number;
    offset: number;
}

export const departmentService = {
    async list(filters: DepartmentFilters) {
        const where: Record<string, unknown> = {};
        if (filters.q) where.name = { [Op.like]: `%${filters.q}%` };
        if (filters.parentDeptId === null) where.parentDeptId = null;
        else if (filters.parentDeptId !== undefined) where.parentDeptId = filters.parentDeptId;

        const { rows, count } = await Department.findAndCountAll({
            where,
            order: [['id', 'ASC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await Department.findByPk(id);
        if (!row) throw ApiError.notFound(Messages.Department.NotFound);
        return row;
    },

    async create(payload: Partial<DepartmentAttributes>) {
        if (!payload.name) throw ApiError.badRequest('name is required');
        if (await Department.findOne({ where: { name: payload.name } })) {
            throw ApiError.conflict(Messages.Department.Exists);
        }
        return Department.create(payload as never);
    },

    async update(id: number, payload: Partial<DepartmentAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async listEmployees(id: number) {
        await this.getById(id);
        return Employee.findAll({ where: { departmentId: id } });
    },

    async listDesignations(id: number) {
        await this.getById(id);
        return Designation.findAll({ where: { departmentId: id } });
    },

    async listChildren(id: number) {
        await this.getById(id);
        return Department.findAll({ where: { parentDeptId: id } });
    },

    async withRelations(id: number) {
        const row = await Department.findByPk(id, {
            include: [
                { association: 'manager' },
                { association: 'parent' },
                { association: 'children' },
                { association: 'designations' },
            ],
        });
        if (!row) throw ApiError.notFound(Messages.Department.NotFound);
        return row;
    },
};
