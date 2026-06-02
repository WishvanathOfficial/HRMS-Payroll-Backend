jest.mock('../../../services/payrollRun.service', () => ({
    payrollRunService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        process: jest.fn(),
        lock: jest.fn(),
    },
}));

import { payrollRunController } from './payrollRun.controller';
import { payrollRunService } from '../../../services/payrollRun.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = payrollRunService as unknown as Record<string, jest.Mock>;

describe('payrollRunController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by year/month/status', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await payrollRunController.list(
            mockRequest({ query: { year: '2026', month: '4', status: 'COMPLETED' } }),
            res as never,
        );
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ year: 2026, month: 4, status: 'COMPLETED' }));
    });

    it('process delegates with processedBy', async () => {
        svc.process.mockResolvedValue({});
        const res = mockResponse();
        await payrollRunController.process(
            mockRequest({ params: { id: '1' } as never, body: { processedBy: 7 } }),
            res as never,
        );
        expect(svc.process).toHaveBeenCalledWith(1, 7);
    });

    it('lock delegates', async () => {
        svc.lock.mockResolvedValue({});
        const res = mockResponse();
        await payrollRunController.lock(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.lock).toHaveBeenCalledWith(1);
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await payrollRunController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await payrollRunController.create(mockRequest({ body: { month: 4, year: 2026 } }), res as never);
        await payrollRunController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await payrollRunController.remove(mockRequest({ params: { id: '1' } as never }), res as never);

        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
