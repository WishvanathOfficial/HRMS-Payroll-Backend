import { SalaryComponent } from '../models';
import { SalaryComponentAttributes, ComponentType } from '../models/salary-component';
import { ApiError } from '../utils/ApiError';

export const salaryComponentService = {
    async list(filters: { type?: ComponentType }) {
        const where: Record<string, unknown> = {};
        if (filters.type) where.type = filters.type;
        return SalaryComponent.findAll({ where, order: [['id', 'ASC']] });
    },

    async getById(id: number) {
        const row = await SalaryComponent.findByPk(id);
        if (!row) throw ApiError.notFound('Salary component not found');
        return row;
    },

    async create(payload: Partial<SalaryComponentAttributes>) {
        if (!payload.name || !payload.type || !payload.calcType) {
            throw ApiError.badRequest('name, type and calcType are required');
        }
        if (await SalaryComponent.findOne({ where: { name: payload.name } })) {
            throw ApiError.conflict(`Salary component "${payload.name}" already exists`);
        }
        return SalaryComponent.create(payload as never);
    },

    async update(id: number, payload: Partial<SalaryComponentAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },
};
