import { sequelize, LeaveRequest, LeaveBalance, Employee, LeaveType } from '../models';
import { LeaveRequestAttributes, LeaveStatus } from '../models/leave-request';
import { ApiError } from '../utils/ApiError';
import { Messages } from '../constants';

const daysInclusive = (from: string, to: string): number => {
    const a = new Date(from).getTime();
    const b = new Date(to).getTime();
    return Math.floor((b - a) / (1000 * 60 * 60 * 24)) + 1;
};

export const leaveRequestService = {
    async list(filters: { employeeId?: number; status?: LeaveStatus; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.employeeId) where.employeeId = filters.employeeId;
        if (filters.status) where.status = filters.status;
        const { rows, count } = await LeaveRequest.findAndCountAll({
            where,
            order: [['createdOn', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await LeaveRequest.findByPk(id);
        if (!row) throw ApiError.notFound('Leave request not found');
        return row;
    },

    async create(payload: Partial<LeaveRequestAttributes>) {
        if (!payload.employeeId || !payload.leaveTypeId || !payload.fromDate || !payload.toDate) {
            throw ApiError.badRequest('employeeId, leaveTypeId, fromDate and toDate are required');
        }
        if (!(await Employee.findByPk(payload.employeeId))) {
            throw ApiError.badRequest(`employeeId ${payload.employeeId} does not exist`);
        }
        if (!(await LeaveType.findByPk(payload.leaveTypeId))) {
            throw ApiError.badRequest(`leaveTypeId ${payload.leaveTypeId} does not exist`);
        }
        const days = payload.days ?? daysInclusive(payload.fromDate, payload.toDate);
        return LeaveRequest.create({ ...payload, days, status: 'PENDING' } as never);
    },

    async update(id: number, payload: Partial<LeaveRequestAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    /** Approve in a transaction so leave balances stays consistent. */
    async approve(id: number, approvedBy: number) {
        const req = await this.getById(id);
        const status = req.get('status') as LeaveStatus;
        if (status !== 'PENDING') throw ApiError.badRequest(Messages.Leave.NotPending);

        const employeeId = req.get('employeeId') as number;
        const leaveTypeId = req.get('leaveTypeId') as number;
        const days = Number(req.get('days'));
        const fromDate = req.get('fromDate') as string;

        await sequelize.transaction(async (trx) => {
            await req.update({ status: 'APPROVED', approvedBy } as never, { transaction: trx });
            const year = new Date(fromDate).getFullYear();
            const bal = await LeaveBalance.findOne({
                where: { employeeId, leaveTypeId, year },
                transaction: trx,
            });
            if (bal) {
                const used = Number(bal.get('used')) + days;
                await bal.update({ used, balance: Number(bal.get('allocated')) - used } as never, { transaction: trx });
            }
        });
        return req.reload();
    },

    async reject(id: number, approvedBy: number) {
        const req = await this.getById(id);
        if (req.get('status') !== 'PENDING') throw ApiError.badRequest(Messages.Leave.NotPending);
        await req.update({ status: 'REJECTED', approvedBy } as never);
        return req;
    },

    async cancel(id: number) {
        const req = await this.getById(id);
        const prev = req.get('status') as LeaveStatus;
        if (prev === 'CANCELLED') return req;

        const employeeId = req.get('employeeId') as number;
        const leaveTypeId = req.get('leaveTypeId') as number;
        const days = Number(req.get('days'));
        const fromDate = req.get('fromDate') as string;

        await sequelize.transaction(async (trx) => {
            await req.update({ status: 'CANCELLED' } as never, { transaction: trx });
            if (prev === 'APPROVED') {
                const year = new Date(fromDate).getFullYear();
                const bal = await LeaveBalance.findOne({
                    where: { employeeId, leaveTypeId, year },
                    transaction: trx,
                });
                if (bal) {
                    const used = Math.max(0, Number(bal.get('used')) - days);
                    await bal.update({ used, balance: Number(bal.get('allocated')) - used } as never, {
                        transaction: trx,
                    });
                }
            }
        });
        return req.reload();
    },

    async listWithRelations(filters: { status?: LeaveStatus; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.status) where.status = filters.status;
        return LeaveRequest.findAll({
            where,
            include: [
                { association: 'employee', attributes: ['id', 'firstName', 'lastName', 'empCode'] },
                { association: 'leaveType', attributes: ['id', 'name', 'isPaid'] },
                { association: 'approver', attributes: ['id', 'firstName', 'lastName'] },
            ],
            order: [['createdOn', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
    },
};
