jest.mock('../../../services/employeeShift.service', () => ({
    employeeShiftService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        currentByEmployee: jest.fn(),
        historyByEmployee: jest.fn(),
    },
}));

import { employeeShiftController } from './employeeShift.controller';
import { employeeShiftService } from '../../../services/employeeShift.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = employeeShiftService as unknown as Record<string, jest.Mock>;

describe('employeeShiftController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list paginates + delegates', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await employeeShiftController.list(mockRequest({ query: { employeeId: '1', shiftId: '2' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ employeeId: 1, shiftId: 2 }));
    });

    it('CRUD + current + history delegate', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        svc.currentByEmployee.mockResolvedValue({});
        svc.historyByEmployee.mockResolvedValue([]);
        const res = mockResponse();

        await employeeShiftController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeShiftController.create(mockRequest({ body: {} }), res as never);
        await employeeShiftController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await employeeShiftController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeShiftController.current(mockRequest({ params: { employeeId: '7' } as never }), res as never);
        await employeeShiftController.history(mockRequest({ params: { employeeId: '7' } as never }), res as never);

        expect(svc.currentByEmployee).toHaveBeenCalledWith(7);
        expect(svc.historyByEmployee).toHaveBeenCalledWith(7);
    });
});
