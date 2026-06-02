import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { employeeAppraisalService } from '../../../services/employeeAppraisal.service';

export const employeeAppraisalController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await employeeAppraisalService.list({
            cycleId: req.query.cycleId ? Number(req.query.cycleId) : undefined,
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeAppraisalService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await employeeAppraisalService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeAppraisalService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await employeeAppraisalService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async finalize(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await employeeAppraisalService.finalize(Number(req.params.id), Number(req.body.finalRating)),
            'Appraisal finalized',
        );
    },
};
