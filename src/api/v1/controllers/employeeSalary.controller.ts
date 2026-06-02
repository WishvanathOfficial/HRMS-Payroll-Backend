import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { employeeSalaryService } from '../../../services/employeeSalary.service';

export const employeeSalaryController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await employeeSalaryService.list({
            employeeId: req.query.employeeId ? Number(req.query.employeeId) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeSalaryService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await employeeSalaryService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeSalaryService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await employeeSalaryService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async current(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeSalaryService.currentByEmployee(Number(req.params.employeeId)));
    },
};
