jest.mock('../../../services/attendanceLog.service', () => ({
    attendanceLogService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        checkIn: jest.fn(),
        checkOut: jest.fn(),
        summary: jest.fn(),
    },
}));

import { attendanceLogController } from './attendanceLog.controller';
import { attendanceLogService } from '../../../services/attendanceLog.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';
import { ApiError } from '../../../utils/ApiError';

const svc = attendanceLogService as unknown as Record<string, jest.Mock>;

describe('attendanceLogController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters and paginates', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await attendanceLogController.list(
            mockRequest({ query: { employeeId: '1', status: 'PRESENT', from: '2026-05-01', to: '2026-05-31' } }),
            res as never,
        );
        expect(svc.list).toHaveBeenCalledWith(
            expect.objectContaining({ employeeId: 1, status: 'PRESENT', from: '2026-05-01' }),
        );
    });

    it('checkIn rejects missing employeeId', async () => {
        await expect(
            attendanceLogController.checkIn(mockRequest({ body: {} }), mockResponse() as never),
        ).rejects.toBeInstanceOf(ApiError);
    });

    it('checkIn delegates with source', async () => {
        svc.checkIn.mockResolvedValue({});
        const res = mockResponse();
        await attendanceLogController.checkIn(mockRequest({ body: { employeeId: 5, source: 'WEB' } }), res as never);
        expect(svc.checkIn).toHaveBeenCalledWith(5, 'WEB');
    });

    it('checkOut rejects missing employeeId', async () => {
        await expect(
            attendanceLogController.checkOut(mockRequest({ body: {} }), mockResponse() as never),
        ).rejects.toBeInstanceOf(ApiError);
    });

    it('summary defaults year/month to today if missing', async () => {
        svc.summary.mockResolvedValue({});
        const res = mockResponse();
        await attendanceLogController.summary(
            mockRequest({ params: { employeeId: '1' } as never, query: {} }),
            res as never,
        );
        expect(svc.summary).toHaveBeenCalled();
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();
        await attendanceLogController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await attendanceLogController.create(mockRequest({ body: {} }), res as never);
        await attendanceLogController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await attendanceLogController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
