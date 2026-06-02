import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { leaveBalanceService } from '../../../services/leaveBalance.service';

export const leaveBalanceController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await leaveBalanceService.list({
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            year: req.query.year ? Number(req.query.year) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveBalanceService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await leaveBalanceService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveBalanceService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await leaveBalanceService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async byEmployee(req: Request, res: Response) {
        const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
        return ApiResponse.ok(res, await leaveBalanceService.byEmployee(Number(req.params.employeeId), year));
    },
};
