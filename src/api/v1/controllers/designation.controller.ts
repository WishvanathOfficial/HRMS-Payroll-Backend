import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { designationService } from '../../../services/designation.service';
import { Messages } from '../../../constants';

export const designationController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await designationService.list({
            q: req.query.q as string | undefined,
            departmentId: req.query.departmentId ? Number(req.query.departmentId) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await designationService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await designationService.create(req.body), Messages.Common.Created);
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await designationService.update(Number(req.params.id), req.body),
            Messages.Common.Updated,
        );
    },
    async remove(req: Request, res: Response) {
        await designationService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async withDepartment(req: Request, res: Response) {
        const { limit, offset } = parsePagination(req.query);
        return ApiResponse.ok(res, await designationService.listWithDepartment({ limit, offset }));
    },
};
