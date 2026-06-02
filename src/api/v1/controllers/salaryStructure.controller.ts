import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { salaryStructureService } from '../../../services/salaryStructure.service';

export const salaryStructureController = {
    async list(_req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryStructureService.list());
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryStructureService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await salaryStructureService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryStructureService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await salaryStructureService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async withComponents(req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryStructureService.withComponents(Number(req.params.id)));
    },
};
