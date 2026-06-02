import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    AppraisalCycle: mockModel(),
    EmployeeAppraisal: mockModel(),
}));

import { appraisalCycleService } from './appraisalCycle.service';
import { AppraisalCycle, EmployeeAppraisal } from '../models';
const AC = AppraisalCycle as unknown as ReturnType<typeof mockModel>;
const EA = EmployeeAppraisal as unknown as ReturnType<typeof mockModel>;

describe('appraisalCycleService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by status when given', async () => {
        AC.findAll.mockResolvedValue([]);
        await appraisalCycleService.list({ status: 'ACTIVE' });
        expect(AC.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { status: 'ACTIVE' } }));
    });

    it('getById 404s when missing', async () => {
        AC.findByPk.mockResolvedValue(null);
        await expect(appraisalCycleService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields + rejects duplicates', async () => {
        await expect(appraisalCycleService.create({})).rejects.toMatchObject({ statusCode: 400 });
        AC.findOne.mockResolvedValue({ id: 1 });
        await expect(
            appraisalCycleService.create({ name: 'H1', startDate: '2026-01-01', endDate: '2026-06-30' }),
        ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('create persists when valid', async () => {
        AC.findOne.mockResolvedValue(null);
        AC.create.mockResolvedValue(mockInstance({ id: 1 }));
        await appraisalCycleService.create({ name: 'H1', startDate: '2026-01-01', endDate: '2026-06-30' });
        expect(AC.create).toHaveBeenCalled();
    });

    it('appraisals filters by cycleId', async () => {
        AC.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        EA.findAll.mockResolvedValue([]);
        await appraisalCycleService.appraisals(1);
        expect(EA.findAll).toHaveBeenCalledWith({ where: { cycleId: 1 } });
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        AC.findByPk.mockResolvedValue(inst);
        await appraisalCycleService.update(1, { status: 'CLOSED' });
        expect(inst.update).toHaveBeenCalled();
        await appraisalCycleService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
