import { Op } from 'sequelize';
import { AttendanceLog, Employee } from '../models';
import { AttendanceLogAttributes, AttendanceStatus, AttendanceSource } from '../models/attendance-log';
import { ApiError } from '../utils/ApiError';
import { Messages } from '../constants';

const today = () => new Date().toISOString().slice(0, 10);
const nowDateTime = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const hoursBetween = (start: string, end: string): number => {
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / 36e5;
    return Math.round(diff * 100) / 100;
};

export interface AttendanceFilters {
    employeeId?: number;
    status?: AttendanceStatus;
    from?: string;
    to?: string;
    limit: number;
    offset: number;
}

export const attendanceLogService = {
    async list(filters: AttendanceFilters) {
        const where: Record<string, unknown> = {};
        if (filters.employeeId) where.employeeId = filters.employeeId;
        if (filters.status) where.status = filters.status;
        if (filters.from || filters.to) {
            where.logDate = {
                ...(filters.from ? { [Op.gte]: filters.from } : {}),
                ...(filters.to ? { [Op.lte]: filters.to } : {}),
            };
        }
        const { rows, count } = await AttendanceLog.findAndCountAll({
            where,
            order: [['logDate', 'DESC']],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await AttendanceLog.findByPk(id);
        if (!row) throw ApiError.notFound('Attendance log not found');
        return row;
    },

    async create(payload: Partial<AttendanceLogAttributes>) {
        if (!payload.employeeId || !payload.logDate) {
            throw ApiError.badRequest('employeeId and logDate are required');
        }
        if (!(await Employee.findByPk(payload.employeeId))) {
            throw ApiError.badRequest(`employeeId ${payload.employeeId} does not exist`);
        }
        return AttendanceLog.create(payload as never);
    },

    async update(id: number, payload: Partial<AttendanceLogAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async checkIn(employeeId: number, source: AttendanceSource = 'WEB') {
        if (!(await Employee.findByPk(employeeId))) {
            throw ApiError.badRequest(`employeeId ${employeeId} does not exist`);
        }
        const logDate = today();
        const existing = await AttendanceLog.findOne({ where: { employeeId, logDate } });
        const existingCheckIn = existing?.get('checkIn');
        if (existing && existingCheckIn) throw ApiError.conflict(Messages.Attendance.AlreadyCheckedIn);

        if (existing) {
            await existing.update({ checkIn: nowDateTime(), source } as never);
            return existing;
        }
        return AttendanceLog.create({
            employeeId,
            logDate,
            checkIn: nowDateTime(),
            status: 'PRESENT',
            source,
        } as never);
    },

    async checkOut(employeeId: number) {
        const logDate = today();
        const log = await AttendanceLog.findOne({ where: { employeeId, logDate } });
        if (!log) throw ApiError.notFound(Messages.Attendance.NoCheckIn);
        const checkIn = log.get('checkIn') as string | null;
        const checkOutExisting = log.get('checkOut') as string | null;
        if (!checkIn) throw ApiError.badRequest('Cannot check out without check-in');
        if (checkOutExisting) throw ApiError.conflict(Messages.Attendance.AlreadyCheckedOut);

        const checkOut = nowDateTime();
        const workHours = hoursBetween(checkIn, checkOut);
        await log.update({ checkOut, workHours } as never);
        return log;
    },

    async summary(employeeId: number, year: number, month: number) {
        const from = `${year}-${String(month).padStart(2, '0')}-01`;
        const toDate = new Date(year, month, 0);
        const to = toDate.toISOString().slice(0, 10);
        const rows = await AttendanceLog.findAll({
            where: { employeeId, logDate: { [Op.gte]: from, [Op.lte]: to } },
            order: [['logDate', 'ASC']],
        });
        const counts = (s: AttendanceStatus) => rows.filter((r) => r.get('status') === s).length;
        return {
            from,
            to,
            totalDays: rows.length,
            present: counts('PRESENT'),
            absent: counts('ABSENT'),
            halfDay: counts('HALF_DAY'),
            late: counts('LATE'),
            onLeave: counts('ON_LEAVE'),
            totalWorkHours: rows.reduce((sum, r) => sum + Number(r.get('workHours') || 0), 0),
            logs: rows,
        };
    },
};
