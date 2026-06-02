import { StatutoryDeduction, Payslip } from '../models';
import { StatutoryDeductionAttributes, StatutoryType } from '../models/statutory-deduction';
import { ApiError } from '../utils/ApiError';

export const statutoryDeductionService = {
    async list(filters: { payslipId?: number; type?: StatutoryType }) {
        const where: Record<string, unknown> = {};
        if (filters.payslipId) where.payslipId = filters.payslipId;
        if (filters.type) where.type = filters.type;
        return StatutoryDeduction.findAll({ where, order: [['id', 'ASC']] });
    },

    async getById(id: number) {
        const row = await StatutoryDeduction.findByPk(id);
        if (!row) throw ApiError.notFound('Statutory deduction not found');
        return row;
    },

    async create(payload: Partial<StatutoryDeductionAttributes>) {
        if (!payload.payslipId || !payload.type) throw ApiError.badRequest('payslipId and type are required');
        if (!(await Payslip.findByPk(payload.payslipId))) {
            throw ApiError.badRequest(`payslipId ${payload.payslipId} does not exist`);
        }
        return StatutoryDeduction.create(payload as never);
    },

    async update(id: number, payload: Partial<StatutoryDeductionAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },
};
