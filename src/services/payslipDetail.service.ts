import { PayslipDetail, Payslip, SalaryComponent } from '../models';
import { PayslipDetailAttributes } from '../models/payslip-detail';
import { ApiError } from '../utils/ApiError';

export const payslipDetailService = {
    async list(filters: { payslipId?: number }) {
        const where: Record<string, unknown> = {};
        if (filters.payslipId) where.payslipId = filters.payslipId;
        return PayslipDetail.findAll({ where, order: [['id', 'ASC']] });
    },

    async getById(id: number) {
        const row = await PayslipDetail.findByPk(id);
        if (!row) throw ApiError.notFound('Payslip detail not found');
        return row;
    },

    async create(payload: Partial<PayslipDetailAttributes>) {
        if (!payload.payslipId || !payload.componentId || !payload.componentType) {
            throw ApiError.badRequest('payslipId, componentId and componentType are required');
        }
        if (!(await Payslip.findByPk(payload.payslipId))) {
            throw ApiError.badRequest(`payslipId ${payload.payslipId} does not exist`);
        }
        if (!(await SalaryComponent.findByPk(payload.componentId))) {
            throw ApiError.badRequest(`componentId ${payload.componentId} does not exist`);
        }
        return PayslipDetail.create(payload as never);
    },

    async update(id: number, payload: Partial<PayslipDetailAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },
};
