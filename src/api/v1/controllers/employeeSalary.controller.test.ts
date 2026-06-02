jest.mock('../../../services/employeeSalary.service', () => ({
    employeeSalaryService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        currentByEmployee: jest.fn(),
    },
}));

import { employeeSalaryController } from './employeeSalary.controller';
import { employeeSalaryService } from '../../../services/employeeSalary.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = employeeSalaryService as unknown as Record<string, jest.Mock>;

describe('employeeSalaryController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list paginates + delegates', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await employeeSalaryController.list(mockRequest({ query: { employeeId: '5' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ employeeId: 5 }));
    });

    it('CRUD + current delegate', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        svc.currentByEmployee.mockResolvedValue({});
        const res = mockResponse();

        await employeeSalaryController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeSalaryController.create(mockRequest({ body: {} }), res as never);
        await employeeSalaryController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await employeeSalaryController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeSalaryController.current(mockRequest({ params: { employeeId: '7' } as never }), res as never);

        expect(svc.currentByEmployee).toHaveBeenCalledWith(7);
    });
});
