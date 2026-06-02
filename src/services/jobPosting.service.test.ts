import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    JobPosting: mockModel(),
    Department: mockModel(),
    Designation: mockModel(),
    Applicant: mockModel(),
}));

import { jobPostingService } from './jobPosting.service';
import { JobPosting, Department, Designation, Applicant } from '../models';
const JP = JobPosting as unknown as ReturnType<typeof mockModel>;
const Dept = Department as unknown as ReturnType<typeof mockModel>;
const Desg = Designation as unknown as ReturnType<typeof mockModel>;
const App = Applicant as unknown as ReturnType<typeof mockModel>;

describe('jobPostingService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        JP.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(jobPostingService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        JP.findByPk.mockResolvedValue(null);
        await expect(jobPostingService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields + validates FKs', async () => {
        await expect(jobPostingService.create({})).rejects.toMatchObject({ statusCode: 400 });

        Dept.findByPk.mockResolvedValue(null);
        await expect(
            jobPostingService.create({ designationId: 1, departmentId: 9, postedOn: '2026-04-01' }),
        ).rejects.toMatchObject({ statusCode: 400 });

        Dept.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Desg.findByPk.mockResolvedValue(null);
        await expect(
            jobPostingService.create({ designationId: 9, departmentId: 1, postedOn: '2026-04-01' }),
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create persists when valid', async () => {
        Dept.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Desg.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        JP.create.mockResolvedValue(mockInstance({ id: 1 }));
        await jobPostingService.create({ designationId: 1, departmentId: 1, postedOn: '2026-04-01' });
        expect(JP.create).toHaveBeenCalled();
    });

    it('close updates status to CLOSED', async () => {
        const inst = mockInstance({ id: 1, status: 'OPEN' });
        JP.findByPk.mockResolvedValue(inst);
        await jobPostingService.close(1);
        expect(inst.update).toHaveBeenCalledWith({ status: 'CLOSED' });
    });

    it('applicants queries by jobPostingId', async () => {
        JP.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        App.findAll.mockResolvedValue([]);
        await jobPostingService.applicants(1);
        expect(App.findAll).toHaveBeenCalledWith({ where: { jobPostingId: 1 } });
    });

    it('listWithRelations includes department + designation', async () => {
        JP.findAll.mockResolvedValue([]);
        await jobPostingService.listWithRelations({ limit: 10, offset: 0 });
        expect(JP.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                include: expect.arrayContaining([
                    expect.objectContaining({ association: 'department' }),
                    expect.objectContaining({ association: 'designation' }),
                ]),
            }),
        );
    });
});
