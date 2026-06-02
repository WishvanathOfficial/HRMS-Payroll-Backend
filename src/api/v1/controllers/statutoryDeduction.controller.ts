import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { statutoryDeductionService } from '../../../services/statutoryDeduction.service';
import { StatutoryType } from '../../../models/statutory-deduction';

export const statutoryDeductionController = {
    async list(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await statutoryDeductionService.list({
                payslipId: req.query.payslipId ? Number(req.query.payslipId) : undefined,
                type: req.query.type as StatutoryType | undefined,
            }),
        );
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await statutoryDeductionService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await statutoryDeductionService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await statutoryDeductionService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await statutoryDeductionService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
};
