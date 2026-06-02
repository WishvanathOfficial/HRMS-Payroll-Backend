import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { leaveTypeService } from '../../../services/leaveType.service';

export const leaveTypeController = {
    async list(_req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveTypeService.list());
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveTypeService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await leaveTypeService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await leaveTypeService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await leaveTypeService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
};
