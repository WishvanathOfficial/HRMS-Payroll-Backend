import { InterviewStage, Applicant } from '../models';
import { InterviewStageAttributes, InterviewResult } from '../models/interview-stage';
import { ApiError } from '../utils/ApiError';

export const interviewStageService = {
    async list(filters: { applicantId?: number; result?: InterviewResult }) {
        const where: Record<string, unknown> = {};
        if (filters.applicantId) where.applicantId = filters.applicantId;
        if (filters.result) where.result = filters.result;
        return InterviewStage.findAll({ where, order: [['scheduledOn', 'ASC']] });
    },

    async getById(id: number) {
        const row = await InterviewStage.findByPk(id);
        if (!row) throw ApiError.notFound('Interview stage not found');
        return row;
    },

    async create(payload: Partial<InterviewStageAttributes>) {
        if (!payload.applicantId || !payload.stage) {
            throw ApiError.badRequest('applicantId and stage are required');
        }
        if (!(await Applicant.findByPk(payload.applicantId))) {
            throw ApiError.badRequest(`applicantId ${payload.applicantId} does not exist`);
        }
        return InterviewStage.create(payload as never);
    },

    async update(id: number, payload: Partial<InterviewStageAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const row = await this.getById(id);
        await row.destroy();
    },

    async recordResult(id: number, result: InterviewResult, feedback?: string) {
        if (!result) throw ApiError.badRequest('result is required');
        const row = await this.getById(id);
        await row.update({ result, feedback: feedback ?? null } as never);
        return row;
    },

    async byApplicant(applicantId: number) {
        return InterviewStage.findAll({ where: { applicantId }, order: [['scheduledOn', 'ASC']] });
    },
};
