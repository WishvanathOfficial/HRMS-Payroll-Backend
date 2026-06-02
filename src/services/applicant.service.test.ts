import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    Applicant: mockModel(),
    JobPosting: mockModel(),
}));

import { applicantService } from './applicant.service';
import { Applicant, JobPosting } from '../models';
const App = Applicant as unknown as ReturnType<typeof mockModel>;
const JP = JobPosting as unknown as ReturnType<typeof mockModel>;

describe('applicantService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        App.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(applicantService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        App.findByPk.mockResolvedValue(null);
        await expect(applicantService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields + validates job posting', async () => {
        await expect(applicantService.create({})).rejects.toMatchObject({ statusCode: 400 });
        JP.findByPk.mockResolvedValue(null);
        await expect(applicantService.create({ name: 'A', email: 'a@b.com', jobPostingId: 9 })).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('create persists when valid', async () => {
        JP.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        App.create.mockResolvedValue(mockInstance({ id: 1 }));
        await applicantService.create({ name: 'A', email: 'a@b.com', jobPostingId: 1 });
        expect(App.create).toHaveBeenCalled();
    });

    it('changeStatus rejects empty status and updates valid', async () => {
        await expect(applicantService.changeStatus(1, '' as never)).rejects.toMatchObject({ statusCode: 400 });
        const inst = mockInstance({ id: 1, status: 'APPLIED' });
        App.findByPk.mockResolvedValue(inst);
        await applicantService.changeStatus(1, 'HIRED');
        expect(inst.update).toHaveBeenCalledWith({ status: 'HIRED' });
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        App.findByPk.mockResolvedValue(inst);
        await applicantService.update(1, { phone: '999' });
        expect(inst.update).toHaveBeenCalled();
        await applicantService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
