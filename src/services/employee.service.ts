import { Op } from 'sequelize';
import { Employee, Department, Designation } from '../models';
import { EmployeeAttributes, EmployeeStatus } from '../models/employee';
import { ApiError } from '../utils/ApiError';
import { Messages } from '../constants';

export interface EmployeeFilters {
    q?: string;
    departmentId?: number;
    designationId?: number;
    status?: EmployeeStatus;
    limit: number;
    offset: number;
}

export const employeeService = {
    async list(filters: EmployeeFilters) {
        const where: Record<string, unknown> = {};
        if (filters.q) {
            where[Op.or as unknown as string] = [
                { firstName: { [Op.like]: `%${filters.q}%` } },
                { lastName: { [Op.like]: `%${filters.q}%` } },
                { email: { [Op.like]: `%${filters.q}%` } },
                { empCode: { [Op.like]: `%${filters.q}%` } },
            ];
        }
        if (filters.departmentId) where.departmentId = filters.departmentId;
        if (filters.designationId) where.designationId = filters.designationId;
        if (filters.status) where.status = filters.status;

        const { rows, count } = await Employee.findAndCountAll({
            where,
            order: [['id', 'ASC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await Employee.findByPk(id);
        if (!row) throw ApiError.notFound(Messages.Employee.NotFound);
        return row;
    },

    async getByEmpCode(empCode: string) {
        const row = await Employee.findOne({ where: { empCode } });
        if (!row) throw ApiError.notFound(Messages.Employee.NotFound);
        return row;
    },

    async create(payload: Partial<EmployeeAttributes>) {
        const required: (keyof EmployeeAttributes)[] = ['empCode', 'firstName', 'lastName', 'email', 'joinDate'];
        for (const k of required) {
            if (payload[k] === undefined || payload[k] === null || payload[k] === '') {
                throw ApiError.badRequest(`${k} is required`);
            }
        }
        const conflict = await Employee.findOne({
            where: { [Op.or]: [{ email: payload.email! }, { empCode: payload.empCode! }] },
        });
        if (conflict) throw ApiError.conflict(Messages.Employee.Exists);

        if (payload.departmentId && !(await Department.findByPk(payload.departmentId))) {
            throw ApiError.badRequest(`departmentId ${payload.departmentId} does not exist`);
        }
        if (payload.designationId && !(await Designation.findByPk(payload.designationId))) {
            throw ApiError.badRequest(`designationId ${payload.designationId} does not exist`);
        }
        if (payload.reportingTo && !(await Employee.findByPk(payload.reportingTo))) {
            throw ApiError.badRequest(`reportingTo ${payload.reportingTo} does not exist`);
        }

        return Employee.create(payload as never);
    },

    async update(id: number, payload: Partial<EmployeeAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async getReportees(id: number) {
        await this.getById(id);
        return Employee.findAll({ where: { reportingTo: id } });
    },

    async setStatus(id: number, status: EmployeeStatus) {
        if (!status) throw ApiError.badRequest('status is required');
        const row = await this.getById(id);
        await row.update({ status } as never);
        return row;
    },

    async fullProfile(id: number) {
        const row = await Employee.findByPk(id, {
            include: [
                { association: 'department' },
                { association: 'designation' },
                { association: 'manager' },
                { association: 'salaries' },
                { association: 'leaveBalances' },
            ],
        });
        if (!row) throw ApiError.notFound(Messages.Employee.NotFound);
        return row;
    },
};
