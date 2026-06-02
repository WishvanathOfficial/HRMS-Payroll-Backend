import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { attendanceLogService } from '../../../services/attendanceLog.service';
import { AttendanceStatus } from '../../../models/attendance-log';
import { ApiError } from '../../../utils/ApiError';

export const attendanceLogController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await attendanceLogService.list({
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            status: req.query.status as AttendanceStatus | undefined,
            from: req.query.from as string | undefined,
            to: req.query.to as string | undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await attendanceLogService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await attendanceLogService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await attendanceLogService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await attendanceLogService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async checkIn(req: Request, res: Response) {
        const employeeId = Number(req.body.employeeId);
        if (!employeeId) throw ApiError.badRequest('employeeId is required');
        return ApiResponse.ok(res, await attendanceLogService.checkIn(employeeId, req.body.source), 'Checked in');
    },
    async checkOut(req: Request, res: Response) {
        const employeeId = Number(req.body.employeeId);
        if (!employeeId) throw ApiError.badRequest('employeeId is required');
        return ApiResponse.ok(res, await attendanceLogService.checkOut(employeeId), 'Checked out');
    },
    async summary(req: Request, res: Response) {
        const employeeId = Number(req.params.employeeId);
        const year = Number(req.query.year) || new Date().getFullYear();
        const month = Number(req.query.month) || new Date().getMonth() + 1;
        return ApiResponse.ok(res, await attendanceLogService.summary(employeeId, year, month));
    },
};
