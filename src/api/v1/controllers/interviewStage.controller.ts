import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { interviewStageService } from '../../../services/interviewStage.service';
import { InterviewResult } from '../../../models/interview-stage';

export const interviewStageController = {
    async list(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await interviewStageService.list({
                applicantId: req.query.applicantId ? Number(req.query.applicantId) : undefined,
                result: req.query.result as InterviewResult | undefined,
            }),
        );
    },
    async getOne(req: Request, res: Response) {
        return ApiResponse.ok(res, await interviewStageService.getById(Number(req.params.id)));
    },
    async create(req: Request, res: Response) {
        return ApiResponse.created(res, await interviewStageService.create(req.body));
    },
    async update(req: Request, res: Response) {
        return ApiResponse.ok(res, await interviewStageService.update(Number(req.params.id), req.body));
    },
    async remove(req: Request, res: Response) {
        await interviewStageService.remove(Number(req.params.id));
        return ApiResponse.noContent(res);
    },
    async recordResult(req: Request, res: Response) {
        return ApiResponse.ok(
            res,
            await interviewStageService.recordResult(Number(req.params.id), req.body.result, req.body.feedback),
            'Interview result recorded',
        );
    },
    async byApplicant(req: Request, res: Response) {
        return ApiResponse.ok(res, await interviewStageService.byApplicant(Number(req.params.applicantId)));
    },
};
