jest.mock('../../../services/payslipDetail.service', () => ({
    payslipDetailService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    },
}));

import { payslipDetailController } from './payslipDetail.controller';
import { payslipDetailService } from '../../../services/payslipDetail.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = payslipDetailService as unknown as Record<string, jest.Mock>;

describe('payslipDetailController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by payslipId', async () => {
        svc.list.mockResolvedValue([]);
        const res = mockResponse();
        await payslipDetailController.list(mockRequest({ query: { payslipId: '5' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith({ payslipId: 5 });
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await payslipDetailController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await payslipDetailController.create(mockRequest({ body: {} }), res as never);
        await payslipDetailController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await payslipDetailController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
