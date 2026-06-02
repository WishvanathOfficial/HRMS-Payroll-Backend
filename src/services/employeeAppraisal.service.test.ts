import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    EmployeeAppraisal: mockModel(),
    AppraisalCycle: mockModel(),
    Employee: mockModel(),
}));

import { employeeAppraisalService } from './employeeAppraisal.service';
import { EmployeeAppraisal, AppraisalCycle, Employee } from '../models';
const EA = EmployeeAppraisal as unknown as ReturnType<typeof mockModel>;
const AC = AppraisalCycle as unknown as ReturnType<typeof mockModel>;
const Emp = Employee as unknown as ReturnType<typeof mockModel>;

describe('employeeAppraisalService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        EA.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(employeeAppraisalService.list({ limit: 10, offset: 0 })).resolves.toEqual({
            rows: [],
            total: 0,
        });
    });

    it('getById 404s when missing', async () => {
        EA.findByPk.mockResolvedValue(null);
        await expect(employeeAppraisalService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires + validates FKs', async () => {
        await expect(employeeAppraisalService.create({})).rejects.toMatchObject({ statusCode: 400 });

        AC.findByPk.mockResolvedValue(null);
        await expect(employeeAppraisalService.create({ cycleId: 9, employeeId: 1 })).rejects.toMatchObject({
            statusCode: 400,
        });

        AC.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Emp.findByPk.mockResolvedValue(null);
        await expect(employeeAppraisalService.create({ cycleId: 1, employeeId: 9 })).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('create persists when valid', async () => {
        AC.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        EA.create.mockResolvedValue(mockInstance({ id: 1 }));
        await employeeAppraisalService.create({ cycleId: 1, employeeId: 1 });
        expect(EA.create).toHaveBeenCalled();
    });

    it('finalize rejects NaN + updates valid', async () => {
        await expect(employeeAppraisalService.finalize(1, Number.NaN)).rejects.toMatchObject({ statusCode: 400 });
        const inst = mockInstance({ id: 1 });
        EA.findByPk.mockResolvedValue(inst);
        await employeeAppraisalService.finalize(1, 4.5);
        expect(inst.update).toHaveBeenCalledWith({ finalRating: 4.5 });
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        EA.findByPk.mockResolvedValue(inst);
        await employeeAppraisalService.update(1, { comments: 'ok' });
        expect(inst.update).toHaveBeenCalled();
        await employeeAppraisalService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
