import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { employmentHistoryService } from '../../../services/employmentHistory.service';

export const employmentHistoryController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await employmentHistoryService.list({
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await employmentHistoryService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await employmentHistoryService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await employmentHistoryService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await employmentHistoryService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async byEmployee(req: Request, res: Response) {
        return ApiResponse.ok(res, await employmentHistoryService.byEmployee(Number(req.params.employeeId)));
    },
};
