import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { salaryStructureComponentService } from '../../../services/salaryStructureComponent.service';

export const salaryStructureComponentController = {
    async list(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await salaryStructureComponentService.list({
                structureId: req.query.structureId ? Number(req.query.structureId) : undefined,
            }),
        );
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryStructureComponentService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await salaryStructureComponentService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryStructureComponentService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await salaryStructureComponentService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
};
