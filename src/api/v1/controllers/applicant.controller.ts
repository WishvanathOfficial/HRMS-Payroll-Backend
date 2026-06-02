import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { parsePagination } from '../../../utils/pagination';
import { applicantService } from '../../../services/applicant.service';
import { ApplicantStatus } from '../../../models/applicant';

export const applicantController = {
    async list(req: Request, res: Response) {
        const { page, limit, offset } = parsePagination(req.query);
        const { rows, total } = await applicantService.list({
            jobPostingId: req.query.jobPostingId ? Number(req.query.jobPostingId) : undefined,
            status: req.query.status as ApplicantStatus | undefined,
            q: req.query.q as string | undefined,
            limit,
            offset,
        });
        return ApiResponse.paginated(res, rows, { page, limit, total });
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await applicantService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await applicantService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await applicantService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await applicantService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async changeStatus(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await applicantService.changeStatus(Number(req.params.id), req.body.status),
            'Applicant status updated',
        );
    },
};
