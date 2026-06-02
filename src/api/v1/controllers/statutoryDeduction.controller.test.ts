jest.mock('../../../services/statutoryDeduction.service', () => ({
    statutoryDeductionService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    },
}));

import { statutoryDeductionController } from './statutoryDeduction.controller';
import { statutoryDeductionService } from '../../../services/statutoryDeduction.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = statutoryDeductionService as unknown as Record<string, jest.Mock>;

describe('statutoryDeductionController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by payslipId + type', async () => {
        svc.list.mockResolvedValue([]);
        const res = mockResponse();
        await statutoryDeductionController.list(mockRequest({ query: { payslipId: '5', type: 'PF' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith({ payslipId: 5, type: 'PF' });
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await statutoryDeductionController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await statutoryDeductionController.create(mockRequest({ body: {} }), res as never);
        await statutoryDeductionController.update(
            mockRequest({ params: { id: '1' } as never, body: {} }),
            res as never,
        );
        await statutoryDeductionController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
