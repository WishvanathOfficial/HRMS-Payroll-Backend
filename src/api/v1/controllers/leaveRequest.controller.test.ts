jest.mock('../../../services/leaveRequest.service', () => ({
    leaveRequestService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        approve: jest.fn(),
        reject: jest.fn(),
        cancel: jest.fn(),
        listWithRelations: jest.fn(),
    },
}));

import { leaveRequestController } from './leaveRequest.controller';
import { leaveRequestService } from '../../../services/leaveRequest.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = leaveRequestService as unknown as Record<string, jest.Mock>;

describe('leaveRequestController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by status + employeeId', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await leaveRequestController.list(mockRequest({ query: { employeeId: '5', status: 'PENDING' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ employeeId: 5, status: 'PENDING' }));
    });

    it('approve + reject + cancel delegate', async () => {
        svc.approve.mockResolvedValue({});
        svc.reject.mockResolvedValue({});
        svc.cancel.mockResolvedValue({});
        const res = mockResponse();

        await leaveRequestController.approve(
            mockRequest({ params: { id: '1' } as never, body: { approvedBy: 7 } }),
            res as never,
        );
        await leaveRequestController.reject(
            mockRequest({ params: { id: '1' } as never, body: { approvedBy: 7 } }),
            res as never,
        );
        await leaveRequestController.cancel(mockRequest({ params: { id: '1' } as never }), res as never);

        expect(svc.approve).toHaveBeenCalledWith(1, 7);
        expect(svc.reject).toHaveBeenCalledWith(1, 7);
        expect(svc.cancel).toHaveBeenCalledWith(1);
    });

    it('CRUD + listWithRelations delegate', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        svc.listWithRelations.mockResolvedValue([]);
        const res = mockResponse();

        await leaveRequestController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await leaveRequestController.create(mockRequest({ body: {} }), res as never);
        await leaveRequestController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await leaveRequestController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await leaveRequestController.listWithRelations(mockRequest({ query: { status: 'PENDING' } }), res as never);

        expect(svc.listWithRelations).toHaveBeenCalled();
    });
});
