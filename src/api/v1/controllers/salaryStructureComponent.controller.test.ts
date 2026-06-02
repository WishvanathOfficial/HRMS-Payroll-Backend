jest.mock('../../../services/salaryStructureComponent.service', () => ({
    salaryStructureComponentService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    },
}));

import { salaryStructureComponentController } from './salaryStructureComponent.controller';
import { salaryStructureComponentService } from '../../../services/salaryStructureComponent.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = salaryStructureComponentService as unknown as Record<string, jest.Mock>;

describe('salaryStructureComponentController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by structureId', async () => {
        svc.list.mockResolvedValue([]);
        const res = mockResponse();
        await salaryStructureComponentController.list(mockRequest({ query: { structureId: '2' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith({ structureId: 2 });
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await salaryStructureComponentController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await salaryStructureComponentController.create(mockRequest({ body: {} }), res as never);
        await salaryStructureComponentController.update(
            mockRequest({ params: { id: '1' } as never, body: {} }),
            res as never,
        );
        await salaryStructureComponentController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
