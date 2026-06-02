jest.mock('../../../services/designation.service', () => ({
    designationService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        listWithDepartment: jest.fn(),
    },
}));

import { designationController } from './designation.controller';
import { designationService } from '../../../services/designation.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = designationService as unknown as Record<string, jest.Mock>;

describe('designationController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns paginated envelope', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await designationController.list(mockRequest(), res as never);
        expect(svc.list).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('CRUD methods delegate to service', async () => {
        svc.getById.mockResolvedValue({ id: 1 });
        svc.create.mockResolvedValue({ id: 1 });
        svc.update.mockResolvedValue({ id: 1 });
        svc.remove.mockResolvedValue(undefined);
        svc.listWithDepartment.mockResolvedValue([]);
        const res = mockResponse();

        await designationController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await designationController.create(mockRequest({ body: { title: 'X', departmentId: 1 } }), res as never);
        await designationController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await designationController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await designationController.withDepartment(mockRequest(), res as never);

        expect(svc.getById).toHaveBeenCalledWith(1);
        expect(svc.create).toHaveBeenCalled();
        expect(svc.update).toHaveBeenCalledWith(1, {});
        expect(svc.remove).toHaveBeenCalledWith(1);
        expect(svc.listWithDepartment).toHaveBeenCalled();
    });
});
