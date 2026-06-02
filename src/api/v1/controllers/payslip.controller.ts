import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { payslipService } from '../../../services/payslip.service';
import { PayslipStatus } from '../../../models/payslip';

export const payslipController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await payslipService.list({
            payrollRunId: req.query.payrollRunId ? Number(req.query.payrollRunId) : undefined,
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            status: req.query.status as PayslipStatus | undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await payslipService.getById(Number(req.params.id)));
    },
    async detailed(req: Request, res: Response) {
        return ApiResponse.ok(res, await payslipService.detailed(Number(req.params.id)));
    },
    async byEmployee(req: Request, res: Response) {
        return ApiResponse.ok(res, await payslipService.byEmployee(Number(req.params.employeeId)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await payslipService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await payslipService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await payslipService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async markPaid(req: Request, res: Response) {
        return ApiResponse.ok(res, await payslipService.markPaid(Number(req.params.id)), 'Payslip marked as paid');
    },
};
