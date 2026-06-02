jest.mock('../../../services/interviewStage.service', () => ({
    interviewStageService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        recordResult: jest.fn(),
        byApplicant: jest.fn(),
    },
}));

import { interviewStageController } from './interviewStage.controller';
import { interviewStageService } from '../../../services/interviewStage.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = interviewStageService as unknown as Record<string, jest.Mock>;

describe('interviewStageController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by applicantId / result', async () => {
        svc.list.mockResolvedValue([]);
        const res = mockResponse();
        await interviewStageController.list(
            mockRequest({ query: { applicantId: '1', result: 'PASSED' } }),
            res as never,
        );
        expect(svc.list).toHaveBeenCalledWith({ applicantId: 1, result: 'PASSED' });
    });

    it('recordResult + byApplicant delegate', async () => {
        svc.recordResult.mockResolvedValue({});
        svc.byApplicant.mockResolvedValue([]);
        const res = mockResponse();

        await interviewStageController.recordResult(
            mockRequest({ params: { id: '1' } as never, body: { result: 'PASSED', feedback: 'ok' } }),
            res as never,
        );
        await interviewStageController.byApplicant(
            mockRequest({ params: { applicantId: '5' } as never }),
            res as never,
        );

        expect(svc.recordResult).toHaveBeenCalledWith(1, 'PASSED', 'ok');
        expect(svc.byApplicant).toHaveBeenCalledWith(5);
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await interviewStageController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await interviewStageController.create(mockRequest({ body: {} }), res as never);
        await interviewStageController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await interviewStageController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
