import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { jobPostingService } from '../../../services/jobPosting.service';
import { JobPostingStatus } from '../../../models/job-posting';

export const jobPostingController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await jobPostingService.list({
            status: req.query.status as JobPostingStatus | undefined,
            departmentId: req.query.departmentId ? Number(req.query.departmentId) : undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await jobPostingService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await jobPostingService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await jobPostingService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await jobPostingService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async close(req: Request, res: Response) {
        return ApiResponse.ok(res, await jobPostingService.close(Number(req.params.id)), 'Posting closed');
    },
    async applicants(req: Request, res: Response) {
        return ApiResponse.ok(res, await jobPostingService.applicants(Number(req.params.id)));
    },
    async withRelations(req: Request, res: Response) {
        const { limit, offset } = parsePagination(req.query);
        return ApiResponse.ok(
            res,
            await jobPostingService.listWithRelations({
                status: req.query.status as JobPostingStatus | undefined,
                limit,
                offset,
            }),
        );
    },
};
