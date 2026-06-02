jest.mock('../../../services/employmentHistory.service', () => ({
    employmentHistoryService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        byEmployee: jest.fn(),
    },
}));

import { employmentHistoryController } from './employmentHistory.controller';
import { employmentHistoryService } from '../../../services/employmentHistory.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = employmentHistoryService as unknown as Record<string, jest.Mock>;

describe('employmentHistoryController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list paginates and delegates', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await employmentHistoryController.list(mockRequest({ query: { employeeId: '1' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ employeeId: 1 }));
    });

    it('CRUD + byEmployee delegate', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        svc.byEmployee.mockResolvedValue([]);
        const res = mockResponse();

        await employmentHistoryController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await employmentHistoryController.create(mockRequest({ body: {} }), res as never);
        await employmentHistoryController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await employmentHistoryController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await employmentHistoryController.byEmployee(
            mockRequest({ params: { employeeId: '7' } as never }),
            res as never,
        );

        expect(svc.byEmployee).toHaveBeenCalledWith(7);
    });
});
