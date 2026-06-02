import { SalaryStructure, SalaryStructureComponent, SalaryComponent } from '../models';
import { SalaryStructureAttributes } from '../models/salary-structure';
import { ApiError } from '../utils/ApiError';

export const salaryStructureService = {
    async list() {
        return SalaryStructure.findAll({ order: [['id', 'ASC']] });
    },

    async getById(id: number) {
        const row = await SalaryStructure.findByPk(id);
        if (!row) throw ApiError.notFound('Salary structure not found');
        return row;
    },

    async create(payload: Partial<SalaryStructureAttributes>) {
        if (!payload.name) throw ApiError.badRequest('name is required');
        if (await SalaryStructure.findOne({ where: { name: payload.name } })) {
            throw ApiError.conflict(`Salary structure "${payload.name}" already exists`);
        }
        return SalaryStructure.create(payload as never);
    },

    async update(id: number, payload: Partial<SalaryStructureAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async withComponents(id: number) {
        const structure = await this.getById(id);
        const mappings = await SalaryStructureComponent.findAll({
            where: { structureId: id },
            include: [{ model: SalaryComponent, as: 'component' }],
        });
        return { structure, components: mappings };
    },
};
