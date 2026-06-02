import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { payrollRunService } from '../../../services/payrollRun.service';
import { PayrollRunStatus } from '../../../models/payroll-run';

export const payrollRunController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await payrollRunService.list({
            year: req.query.year ? Number(req.query.year) : undefined,
            month: req.query.month ? Number(req.query.month) : undefined,
            status: req.query.status as PayrollRunStatus | undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await payrollRunService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await payrollRunService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await payrollRunService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await payrollRunService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async process(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await payrollRunService.process(Number(req.params.id), Number(req.body.processedBy)),
            'Payroll processed',
        );
    },
    async lock(req: Request, res: Response) {
        return ApiResponse.ok(res, await payrollRunService.lock(Number(req.params.id)), 'Payroll locked');
    },
};
