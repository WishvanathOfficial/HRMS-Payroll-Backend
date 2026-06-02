jest.mock('../../../services/employeeAppraisal.service', () => ({
    employeeAppraisalService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        finalize: jest.fn(),
    },
}));

import { employeeAppraisalController } from './employeeAppraisal.controller';
import { employeeAppraisalService } from '../../../services/employeeAppraisal.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = employeeAppraisalService as unknown as Record<string, jest.Mock>;

describe('employeeAppraisalController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by cycleId + employeeId', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await employeeAppraisalController.list(mockRequest({ query: { cycleId: '1', employeeId: '5' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ cycleId: 1, employeeId: 5 }));
    });

    it('finalize delegates', async () => {
        svc.finalize.mockResolvedValue({});
        const res = mockResponse();
        await employeeAppraisalController.finalize(
            mockRequest({ params: { id: '1' } as never, body: { finalRating: 4.5 } }),
            res as never,
        );
        expect(svc.finalize).toHaveBeenCalledWith(1, 4.5);
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await employeeAppraisalController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeAppraisalController.create(mockRequest({ body: {} }), res as never);
        await employeeAppraisalController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await employeeAppraisalController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
