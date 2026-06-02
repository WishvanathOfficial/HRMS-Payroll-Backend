jest.mock('../../../services/jobPosting.service', () => ({
    jobPostingService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        close: jest.fn(),
        applicants: jest.fn(),
        listWithRelations: jest.fn(),
    },
}));

import { jobPostingController } from './jobPosting.controller';
import { jobPostingService } from '../../../services/jobPosting.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = jobPostingService as unknown as Record<string, jest.Mock>;

describe('jobPostingController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by status / departmentId', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await jobPostingController.list(mockRequest({ query: { status: 'OPEN', departmentId: '6' } }), res as never);
        expect(svc.list).toHaveBeenCalledWith(expect.objectContaining({ status: 'OPEN', departmentId: 6 }));
    });

    it('close + applicants + withRelations delegate', async () => {
        svc.close.mockResolvedValue({});
        svc.applicants.mockResolvedValue([]);
        svc.listWithRelations.mockResolvedValue([]);
        const res = mockResponse();

        await jobPostingController.close(mockRequest({ params: { id: '1' } as never }), res as never);
        await jobPostingController.applicants(mockRequest({ params: { id: '1' } as never }), res as never);
        await jobPostingController.withRelations(mockRequest({ query: { status: 'OPEN' } }), res as never);

        expect(svc.close).toHaveBeenCalledWith(1);
        expect(svc.applicants).toHaveBeenCalledWith(1);
        expect(svc.listWithRelations).toHaveBeenCalled();
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await jobPostingController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await jobPostingController.create(mockRequest({ body: {} }), res as never);
        await jobPostingController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await jobPostingController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
