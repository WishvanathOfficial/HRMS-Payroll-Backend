import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { salaryComponentService } from '../../../services/salaryComponent.service';
import { ComponentType } from '../../../models/salary-component';

export const salaryComponentController = {
    async list(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await salaryComponentService.list({ type: req.query.type as ComponentType | undefined }),
        );
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryComponentService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await salaryComponentService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await salaryComponentService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await salaryComponentService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
};
