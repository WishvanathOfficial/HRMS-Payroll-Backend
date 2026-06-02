import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { appraisalCycleService } from '../../../services/appraisalCycle.service';
import { AppraisalCycleStatus } from '../../../models/appraisal-cycle';

export const appraisalCycleController = {
    async list(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await appraisalCycleService.list({
                status: req.query.status as AppraisalCycleStatus | undefined,
            }),
        );
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await appraisalCycleService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await appraisalCycleService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await appraisalCycleService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await appraisalCycleService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async appraisals(req: Request, res: Response) {
        return ApiResponse.ok(res, await appraisalCycleService.appraisals(Number(req.params.id)));
    },
};
