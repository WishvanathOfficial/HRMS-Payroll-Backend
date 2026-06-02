jest.mock('../../../services/salaryStructure.service', () => ({
    salaryStructureService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        withComponents: jest.fn(),
    },
}));

import { salaryStructureController } from './salaryStructure.controller';
import { salaryStructureService } from '../../../services/salaryStructure.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = salaryStructureService as unknown as Record<string, jest.Mock>;

describe('salaryStructureController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('CRUD + withComponents delegate', async () => {
        svc.list.mockResolvedValue([]);
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        svc.withComponents.mockResolvedValue({});
        const res = mockResponse();

        await salaryStructureController.list(mockRequest(), res as never);
        await salaryStructureController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await salaryStructureController.create(mockRequest({ body: { name: 'X' } }), res as never);
        await salaryStructureController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await salaryStructureController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        await salaryStructureController.withComponents(mockRequest({ params: { id: '1' } as never }), res as never);

        expect(svc.withComponents).toHaveBeenCalledWith(1);
    });
});
