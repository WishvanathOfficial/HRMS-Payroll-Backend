import { SalaryStructureComponent, SalaryStructure, SalaryComponent } from '../models';
import { SalaryStructureComponentAttributes } from '../models/salary-structure-component';
import { ApiError } from '../utils/ApiError';

export const salaryStructureComponentService = {
    async list(filters: { structureId?: number }) {
        const where: Record<string, unknown> = {};
        if (filters.structureId) where.structureId = filters.structureId;
        return SalaryStructureComponent.findAll({ where, order: [['id', 'ASC']] });
    },

    async getById(id: number) {
        const row = await SalaryStructureComponent.findByPk(id);
        if (!row) throw ApiError.notFound('Mapping not found');
        return row;
    },

    async create(payload: Partial<SalaryStructureComponentAttributes>) {
        if (!payload.structureId || !payload.componentId) {
            throw ApiError.badRequest('structureId and componentId are required');
        }
        if (!(await SalaryStructure.findByPk(payload.structureId))) {
            throw ApiError.badRequest(`structureId ${payload.structureId} does not exist`);
        }
        if (!(await SalaryComponent.findByPk(payload.componentId))) {
            throw ApiError.badRequest(`componentId ${payload.componentId} does not exist`);
        }
        return SalaryStructureComponent.create(payload as never);
    },

    async update(id: number, payload: Partial<SalaryStructureComponentAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },
};
