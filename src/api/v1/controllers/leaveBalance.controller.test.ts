jest.mock('../../../services/leaveBalance.service', () => ({
    leaveBalanceService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        byEmployee: jest.fn(),
    },
}));

import { leaveBalanceController } from './leaveBalance.controller';
import { leaveBalanceService } from '../../../services/leaveBalance.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = leaveBalanceService as unknown as Record<string, jest.Mock>;

describe('leaveBalanceController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list paginates + delegates', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await leaveBalanceController.list(mockRequest({ query: { employeeId: '5', year: '2026' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ employeeId: 5, year: 2026 }));
    });

    it('CRUD + byEmployee delegate', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        svc.byEmployee.mockResolvedValue([]);
        const res = mockResponse();

        await leaveBalanceController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await leaveBalanceController.create(mockRequest({ body: {} }), res as never);
        await leaveBalanceController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await leaveBalanceController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await leaveBalanceController.byEmployee(
            mockRequest({ params: { employeeId: '7' } as never, query: { year: '2026' } }),
            res as never,
        );

        expect(svc.byEmployee).toHaveBeenCalledWith(7, 2026);
    });
});
