jest.mock('../../../services/appraisalCycle.service', () => ({
    appraisalCycleService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        appraisals: jest.fn(),
    },
}));

import { appraisalCycleController } from './appraisalCycle.controller';
import { appraisalCycleService } from '../../../services/appraisalCycle.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = appraisalCycleService as unknown as Record<string, jest.Mock>;

describe('appraisalCycleController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by status', async () => {
        svc.list.mockResolvedValue([]);
        const res = mockResponse();
        await appraisalCycleController.list(mockRequest({ query: { status: 'ACTIVE' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith({ status: 'ACTIVE' });
    });

    it('appraisals delegates', async () => {
        svc.appraisals.mockResolvedValue([]);
        const res = mockResponse();
        await appraisalCycleController.appraisals(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.appraisals).toHaveBeenCalledWith(1);
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await appraisalCycleController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await appraisalCycleController.create(mockRequest({ body: {} }), res as never);
        await appraisalCycleController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await appraisalCycleController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
