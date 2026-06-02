jest.mock('../../../services/salaryComponent.service', () => ({
    salaryComponentService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    },
}));

import { salaryComponentController } from './salaryComponent.controller';
import { salaryComponentService } from '../../../services/salaryComponent.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = salaryComponentService as unknown as Record<string, jest.Mock>;

describe('salaryComponentController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list passes type filter', async () => {
        svc.list.mockResolvedValue([]);
        const res = mockResponse();
        await salaryComponentController.list(mockRequest({ query: { type: 'EARNING' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith({ type: 'EARNING' });
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await salaryComponentController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await salaryComponentController.create(mockRequest({ body: {} }), res as never);
        await salaryComponentController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await salaryComponentController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
