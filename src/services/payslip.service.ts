import { Payslip } from '../models';
import { PayslipAttributes, PayslipStatus } from '../models/payslip';
import { ApiError } from '../utils/ApiError';

export const payslipService = {
    async list(filters: {
        payrollRunId?: number;
        employeeId?: number;
        status?: PayslipStatus;
        limit: number;
        offset: number;
    }) {
        const where: Record<string, unknown> = {};
        if (filters.payrollRunId) where.payrollRunId = filters.payrollRunId;
        if (filters.employeeId) where.employeeId = filters.employeeId;
        if (filters.status) where.status = filters.status;
        const { rows, count } = await Payslip.findAndCountAll({
            where,
            order: [['id', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await Payslip.findByPk(id);
        if (!row) throw ApiError.notFound('Payslip not found');
        return row;
    },

    async create(payload: Partial<PayslipAttributes>) {
        if (!payload.payrollRunId || !payload.employeeId) {
            throw ApiError.badRequest('payrollRunId and employeeId are required');
        }
        return Payslip.create(payload as never);
    },

    async update(id: number, payload: Partial<PayslipAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async detailed(id: number) {
        const row = await Payslip.findByPk(id, {
            include: [
                { association: 'employee', attributes: ['id', 'firstName', 'lastName', 'empCode', 'email'] },
                { association: 'payrollRun' },
                { association: 'details', include: [{ association: 'component' }] },
                { association: 'statutoryDeductions' },
            ],
        });
        if (!row) throw ApiError.notFound('Payslip not found');
        return row;
    },

    async byEmployee(employeeId: number) {
        return Payslip.findAll({ where: { employeeId }, order: [['id', 'DESC']] });
    },

    async markPaid(id: number) {
        const row = await this.getById(id);
        await row.update({ status: 'PAID' } as never);
        return row;
    },
};
