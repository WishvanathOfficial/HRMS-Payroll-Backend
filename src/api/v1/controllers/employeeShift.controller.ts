import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { employeeShiftService } from '../../../services/employeeShift.service';

export const employeeShiftController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await employeeShiftService.list({
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            shiftId: req.query.shiftId ? Number(req.query.shiftId) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeShiftService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await employeeShiftService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeShiftService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await employeeShiftService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async current(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeShiftService.currentByEmployee(Number(req.params.employeeId)));
    },
    async history(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeShiftService.historyByEmployee(Number(req.params.employeeId)));
    },
};
