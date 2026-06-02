jest.mock('../../../services/employee.service', () => ({
    employeeService: {
        list: jest.fn(),
        getById: jest.fn(),
        getByEmpCode: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        getReportees: jest.fn(),
        setStatus: jest.fn(),
        fullProfile: jest.fn(),
    },
}));

import { employeeController } from './employee.controller';
import { employeeService } from '../../../services/employee.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = employeeService as unknown as Record<string, jest.Mock>;

describe('employeeController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list passes filters + pagination to service', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await employeeController.list(
            mockRequest({
                query: { q: 'aar', departmentId: '1', designationId: '2', status: 'ACTIVE', page: '2', limit: '10' },
            }),
            res as never,
        );
        expect(svc.list).toHaveBeenCalledWith(
            expect.objectContaining({ q: 'aar', departmentId: 1, designationId: 2, status: 'ACTIVE', limit: 10 }),
        );
    });

    it('getByCode passes the code through', async () => {
        svc.getByEmpCode.mockResolvedValue({ id: 1 });
        const res = mockResponse();
        await employeeController.getByCode(mockRequest({ params: { code: 'EMP1' } as never }), res as never);
        expect(svc.getByEmpCode).toHaveBeenCalledWith('EMP1');
    });

    it('CRUD + status + profile delegate', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        svc.getReportees.mockResolvedValue([]);
        svc.setStatus.mockResolvedValue({});
        svc.fullProfile.mockResolvedValue({});
        const res = mockResponse();

        await employeeController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeController.create(mockRequest({ body: { empCode: 'X' } }), res as never);
        await employeeController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await employeeController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeController.reportees(mockRequest({ params: { id: '1' } as never }), res as never);
        await employeeController.setStatus(
            mockRequest({ params: { id: '1' } as never, body: { status: 'INACTIVE' } }),
            res as never,
        );
        await employeeController.fullProfile(mockRequest({ params: { id: '1' } as never }), res as never);

        expect(svc.setStatus).toHaveBeenCalledWith(1, 'INACTIVE');
        expect(svc.fullProfile).toHaveBeenCalledWith(1);
    });
});
