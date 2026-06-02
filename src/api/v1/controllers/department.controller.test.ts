jest.mock('../../../services/department.service', () => ({
    departmentService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        listEmployees: jest.fn(),
        listDesignations: jest.fn(),
        listChildren: jest.fn(),
        withRelations: jest.fn(),
    },
}));

import { departmentController } from './department.controller';
import { departmentService } from '../../../services/department.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = departmentService as unknown as Record<string, jest.Mock>;

describe('departmentController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list responds with paginated envelope', async () => {
        svc.list.mockResolvedValue({ rows: [{ id: 1 }], total: 1 });
        const res = mockResponse();
        await departmentController.list(mockRequest({ query: { page: '1', limit: '20' } }), res as never);

        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ limit: 20, offset: 0 }));
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                data: [{ id: 1 }],
                meta: { pagination: expect.objectContaining({ total: 1 }) },
            }),
        );
    });

    it('getOne returns 200 with the row', async () => {
        svc.getById.mockResolvedValue({ id: 1 });
        const res = mockResponse();
        await departmentController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.getById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('create returns 201', async () => {
        svc.create.mockResolvedValue({ id: 5 });
        const res = mockResponse();
        await departmentController.create(mockRequest({ body: { name: 'Eng' } }), res as never);
        expect(svc.create).toHaveBeenCalledWith({ name: 'Eng' });
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('update calls service and returns 200', async () => {
        svc.update.mockResolvedValue({ id: 1, name: 'New' });
        const res = mockResponse();
        await departmentController.update(
            mockRequest({ params: { id: '1' } as never, body: { name: 'New' } }),
            res as never,
        );
        expect(svc.update).toHaveBeenCalledWith(1, { name: 'New' });
    });

    it('remove returns 204', async () => {
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();
        await departmentController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('employees/designations/children/withRelations delegate', async () => {
        svc.listEmployees.mockResolvedValue([]);
        svc.listDesignations.mockResolvedValue([]);
        svc.listChildren.mockResolvedValue([]);
        svc.withRelations.mockResolvedValue({ id: 1 });

        const res = mockResponse();
        await departmentController.employees(mockRequest({ params: { id: '1' } as never }), res as never);
        await departmentController.designations(mockRequest({ params: { id: '1' } as never }), res as never);
        await departmentController.children(mockRequest({ params: { id: '1' } as never }), res as never);
        await departmentController.withRelations(mockRequest({ params: { id: '1' } as never }), res as never);

        expect(svc.listEmployees).toHaveBeenCalledWith(1);
        expect(svc.listDesignations).toHaveBeenCalledWith(1);
        expect(svc.listChildren).toHaveBeenCalledWith(1);
        expect(svc.withRelations).toHaveBeenCalledWith(1);
    });
});
