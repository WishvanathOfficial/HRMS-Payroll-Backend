import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { payslipDetailService } from '../../../services/payslipDetail.service';

export const payslipDetailController = {
    async list(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await payslipDetailService.list({
                payslipId: req.query.payslipId ? Number(req.query.payslipId) : undefined,
            }),
        );
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await payslipDetailService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await payslipDetailService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await payslipDetailService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await payslipDetailService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
};
