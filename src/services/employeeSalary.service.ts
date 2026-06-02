import { Op } from 'sequelize';
import { EmployeeSalary, Employee, SalaryStructure } from '../models';
import { EmployeeSalaryAttributes } from '../models/employee-salary';
import { ApiError } from '../utils/ApiError';

export const employeeSalaryService = {
    async list(filters: { employeeId?: number; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.employeeId) where.employeeId = filters.employeeId;
        const { rows, count } = await EmployeeSalary.findAndCountAll({
            where,
            order: [['effectiveFrom', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await EmployeeSalary.findByPk(id);
        if (!row) throw ApiError.notFound('Employee salary not found');
        return row;
    },

    async create(payload: Partial<EmployeeSalaryAttributes>) {
        if (!payload.employeeId || !payload.structureId || !payload.ctc || !payload.effectiveFrom) {
            throw ApiError.badRequest('employeeId, structureId, ctc and effectiveFrom are required');
        }
        if (!(await Employee.findByPk(payload.employeeId))) {
            throw ApiError.badRequest(`employeeId ${payload.employeeId} does not exist`);
        }
        if (!(await SalaryStructure.findByPk(payload.structureId))) {
            throw ApiError.badRequest(`structureId ${payload.structureId} does not exist`);
        }
        return EmployeeSalary.create(payload as never);
    },

    async update(id: number, payload: Partial<EmployeeSalaryAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async currentByEmployee(employeeId: number) {
        const today = new Date().toISOString().slice(0, 10);
        return EmployeeSalary.findOne({
            where: {
                employeeId,
                effectiveFrom: { [Op.lte]: today },
                [Op.or]: [{ effectiveTo: null }, { effectiveTo: { [Op.gte]: today } }],
            },
            order: [['effectiveFrom', 'DESC']],
        });
    },
};
