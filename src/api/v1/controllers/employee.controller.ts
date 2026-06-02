import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { employeeService } from '../../../services/employee.service';
import { EmployeeStatus } from '../../../models/employee';
import { Messages } from '../../../constants';

export const employeeController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await employeeService.list({
            q: req.query.q as string | undefined,
            departmentId: req.query.departmentId ? Number(req.query.departmentId) : undefined,
            designationId: req.query.designationId ? Number(req.query.designationId) : undefined,
            status: req.query.status as EmployeeStatus | undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeService.getById(Number(req.params.id)));
    },
    async getByCode(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeService.getByEmpCode(req.params.code));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await employeeService.create(req.body), Messages.Common.Created);
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await employeeService.update(Number(req.params.id), req.body),
            Messages.Common.Updated,
        );
    },
    async remove(req: Request, res: Response) {
        await employeeService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async reportees(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeService.getReportees(Number(req.params.id)));
    },
    async setStatus(req: Request, res: Response) {
        const row = await employeeService.setStatus(Number(req.params.id), req.body.status);
        return ApiResponse.ok(res, row, 'Employee status updated');
    },
    async fullProfile(req: Request, res: Response) {
        return ApiResponse.ok(res, await employeeService.fullProfile(Number(req.params.id)));
    },
};
