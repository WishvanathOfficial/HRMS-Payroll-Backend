import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { shiftService } from '../../../services/shift.service';

export const shiftController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await shiftService.list({ limit, offset });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await shiftService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await shiftService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await shiftService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await shiftService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
};
