import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { departmentService } from '../../../services/department.service';
import { Messages } from '../../../constants';

export const departmentController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await departmentService.list({
            q: req.query.q as string | undefined,
            parentDeptId: req.query.parentDeptId ? Number(req.query.parentDeptId) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total }, Messages.Common.Fetched);
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await departmentService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await departmentService.create(req.body), Messages.Common.Created);
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await departmentService.update(Number(req.params.id), req.body),
            Messages.Common.Updated,
        );
    },
    async remove(req: Request, res: Response) {
        await departmentService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async employees(req: Request, res: Response) {
        return ApiResponse.ok(res, await departmentService.listEmployees(Number(req.params.id)));
    },
    async designations(req: Request, res: Response) {
        return ApiResponse.ok(res, await departmentService.listDesignations(Number(req.params.id)));
    },
    async children(req: Request, res: Response) {
        return ApiResponse.ok(res, await departmentService.listChildren(Number(req.params.id)));
    },
    async withRelations(req: Request, res: Response) {
        return ApiResponse.ok(res, await departmentService.withRelations(Number(req.params.id)));
    },
};
