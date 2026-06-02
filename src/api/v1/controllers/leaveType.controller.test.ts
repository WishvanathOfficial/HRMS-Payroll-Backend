jest.mock('../../../services/leaveType.service', () => ({
    leaveTypeService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    },
}));

import { leaveTypeController } from './leaveType.controller';
import { leaveTypeService } from '../../../services/leaveType.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = leaveTypeService as unknown as Record<string, jest.Mock>;

describe('leaveTypeController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('CRUD delegates to service', async () => {
        svc.list.mockResolvedValue([]);
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await leaveTypeController.list(mockRequest(), res as never);
        await leaveTypeController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await leaveTypeController.create(mockRequest({ body: { name: 'CL' } }), res as never);
        await leaveTypeController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await leaveTypeController.remove(mockRequest({ params: { id: '1' } as never }), res as never);

        expect(svc.list).toHaveBeenCalled();
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
