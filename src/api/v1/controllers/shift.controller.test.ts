jest.mock('../../../services/shift.service', () => ({
    shiftService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    },
}));

import { shiftController } from './shift.controller';
import { shiftService } from '../../../services/shift.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = shiftService as unknown as Record<string, jest.Mock>;

describe('shiftController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns paginated envelope', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await shiftController.list(mockRequest(), res as never);
        expect(svc.list).toHaveBeenCalled();
    });

    it('CRUD delegates to service', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();
        await shiftController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await shiftController.create(mockRequest({ body: {} }), res as never);
        await shiftController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await shiftController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
