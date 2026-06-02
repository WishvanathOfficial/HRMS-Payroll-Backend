jest.mock('../../../services/payslip.service', () => ({
    payslipService: {
        list: jest.fn(),
        getById: jest.fn(),
        detailed: jest.fn(),
        byEmployee: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        markPaid: jest.fn(),
    },
}));

import { payslipController } from './payslip.controller';
import { payslipService } from '../../../services/payslip.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = payslipService as unknown as Record<string, jest.Mock>;

describe('payslipController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by runId / employeeId / status', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await payslipController.list(
            mockRequest({ query: { payrollRunId: '1', employeeId: '5', status: 'PAID' } }),
            res as never,
        );
        expect(svc.list).toHaveBeenCalledWith(
            expect.objectContaining({ payrollRunId: 1, employeeId: 5, status: 'PAID' }),
        );
    });

    it('detailed + byEmployee + markPaid delegate', async () => {
        svc.detailed.mockResolvedValue({});
        svc.byEmployee.mockResolvedValue([]);
        svc.markPaid.mockResolvedValue({});
        const res = mockResponse();

        await payslipController.detailed(mockRequest({ params: { id: '1' } as never }), res as never);
        await payslipController.byEmployee(mockRequest({ params: { employeeId: '7' } as never }), res as never);
        await payslipController.markPaid(mockRequest({ params: { id: '1' } as never }), res as never);

        expect(svc.detailed).toHaveBeenCalledWith(1);
        expect(svc.byEmployee).toHaveBeenCalledWith(7);
        expect(svc.markPaid).toHaveBeenCalledWith(1);
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await payslipController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await payslipController.create(mockRequest({ body: {} }), res as never);
        await payslipController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await payslipController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
