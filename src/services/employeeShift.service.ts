import { Op } from 'sequelize';
import { EmployeeShift, Employee, Shift } from '../models';
import { EmployeeShiftAttributes } from '../models/employee-shift';
import { ApiError } from '../utils/ApiError';

export const employeeShiftService = {
    async list(filters: { employeeId?: number; shiftId?: number; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.employeeId) where.employeeId = filters.employeeId;
        if (filters.shiftId) where.shiftId = filters.shiftId;
        const { rows, count } = await EmployeeShift.findAndCountAll({
            where,
            order: [['effectiveFrom', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await EmployeeShift.findByPk(id);
        if (!row) throw ApiError.notFound('Employee shift not found');
        return row;
    },

    async create(payload: Partial<EmployeeShiftAttributes>) {
        if (!payload.employeeId || !payload.shiftId || !payload.effectiveFrom) {
            throw ApiError.badRequest('employeeId, shiftId and effectiveFrom are required');
        }
        if (!(await Employee.findByPk(payload.employeeId))) {
            throw ApiError.badRequest(`employeeId ${payload.employeeId} does not exist`);
        }
        if (!(await Shift.findByPk(payload.shiftId))) {
            throw ApiError.badRequest(`shiftId ${payload.shiftId} does not exist`);
        }
        return EmployeeShift.create(payload as never);
    },

    async update(id: number, payload: Partial<EmployeeShiftAttributes>) {
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
        return EmployeeShift.findOne({
            where: {
                employeeId,
                effectiveFrom: { [Op.lte]: today },
                [Op.or]: [{ effectiveTo: null }, { effectiveTo: { [Op.gte]: today } }],
            },
            include: [{ association: 'shift' }],
        });
    },

    async historyByEmployee(employeeId: number) {
        return EmployeeShift.findAll({
            where: { employeeId },
            include: [{ association: 'shift' }],
            order: [['effectiveFrom', 'DESC']],
        });
    },
};
