jest.mock('../../../services/applicant.service', () => ({
    applicantService: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        changeStatus: jest.fn(),
    },
}));

import { applicantController } from './applicant.controller';
import { applicantService } from '../../../services/applicant.service';
import { mockRequest, mockResponse } from '../../../__tests__/helpers/express';

const svc = applicantService as unknown as Record<string, jest.Mock>;

describe('applicantController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters + paginates', async () => {
        svc.list.mockResolvedValue({ rows: [], total: 0 });
        const res = mockResponse();
        await applicantController.list(
            mockRequest({ query: { jobPostingId: '1', status: 'APPLIED', q: 'rahul' } }),
            res as never,
        );
        expect(svc.list).toHaveBeenCalledWith(
            expect.objectContaining({ jobPostingId: 1, status: 'APPLIED', q: 'rahul' }),
        );
    });

    it('changeStatus delegates', async () => {
        svc.changeStatus.mockResolvedValue({});
        const res = mockResponse();
        await applicantController.changeStatus(
            mockRequest({ params: { id: '1' } as never, body: { status: 'HIRED' } }),
            res as never,
        );
        expect(svc.changeStatus).toHaveBeenCalledWith(1, 'HIRED');
    });

    it('CRUD delegates', async () => {
        svc.getById.mockResolvedValue({});
        svc.create.mockResolvedValue({});
        svc.update.mockResolvedValue({});
        svc.remove.mockResolvedValue(undefined);
        const res = mockResponse();

        await applicantController.getOne(mockRequest({ params: { id: '1' } as never }), res as never);
        await applicantController.create(mockRequest({ body: {} }), res as never);
        await applicantController.update(mockRequest({ params: { id: '1' } as never, body: {} }), res as never);
        await applicantController.remove(mockRequest({ params: { id: '1' } as never }), res as never);
        expect(svc.remove).toHaveBeenCalledWith(1);
    });
});
