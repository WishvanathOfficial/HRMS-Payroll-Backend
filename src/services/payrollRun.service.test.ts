import { mockModel, mockInstance, mockSequelize } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    sequelize: mockSequelize(),
    PayrollRun: mockModel(),
    Payslip: mockModel(),
    PayslipDetail: mockModel(),
    StatutoryDeduction: mockModel(),
    EmployeeSalary: mockModel(),
    SalaryStructureComponent: mockModel(),
    SalaryComponent: mockModel(),
}));

import { payrollRunService } from './payrollRun.service';
import {
    PayrollRun,
    Payslip,
    PayslipDetail,
    StatutoryDeduction,
    EmployeeSalary,
    SalaryStructureComponent,
    SalaryComponent,
    sequelize,
} from '../models';
const PR = PayrollRun as unknown as ReturnType<typeof mockModel>;
const PS = Payslip as unknown as ReturnType<typeof mockModel>;
const PD = PayslipDetail as unknown as ReturnType<typeof mockModel>;
const SD = StatutoryDeduction as unknown as ReturnType<typeof mockModel>;
const ES = EmployeeSalary as unknown as ReturnType<typeof mockModel>;
const SSC = SalaryStructureComponent as unknown as ReturnType<typeof mockModel>;
const SC = SalaryComponent as unknown as ReturnType<typeof mockModel>;
const db = sequelize as unknown as { transaction: jest.Mock };

describe('payrollRunService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        db.transaction.mockImplementation(async (callback: (transaction: object) => unknown) => callback({}));
    });

    it('list returns count + rows', async () => {
        PR.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(payrollRunService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('create requires month/year and rejects duplicates', async () => {
        await expect(payrollRunService.create({})).rejects.toMatchObject({ statusCode: 400 });
        PR.findOne.mockResolvedValue({ id: 1 });
        await expect(payrollRunService.create({ month: 4, year: 2026 })).rejects.toMatchObject({ statusCode: 409 });
    });

    it('create persists when valid', async () => {
        PR.findOne.mockResolvedValue(null);
        PR.create.mockResolvedValue(mockInstance({ id: 1 }));
        await payrollRunService.create({ month: 4, year: 2026 });
        expect(PR.create).toHaveBeenCalled();
    });

    it('remove rejects completed/locked', async () => {
        PR.findByPk.mockResolvedValue(mockInstance({ id: 1, status: 'COMPLETED' }));
        await expect(payrollRunService.remove(1)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('process rejects already-completed runs', async () => {
        PR.findByPk.mockResolvedValue(mockInstance({ id: 1, status: 'COMPLETED' }));
        await expect(payrollRunService.process(1, 1)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('process builds payslips from active salaries', async () => {
        const runInst = mockInstance({ id: 1, status: 'DRAFT' });
        PR.findByPk.mockResolvedValue(runInst);

        // No existing payslips
        PS.findAll.mockResolvedValue([]);
        // One active salary
        ES.findAll.mockResolvedValue([mockInstance({ id: 1, employeeId: 5, structureId: 1, ctc: 1_200_000 })]);
        // Two mappings — one earning, one deduction
        SSC.findAll.mockResolvedValue([
            mockInstance({ componentId: 10, percentage: 40, amount: 0 }),
            mockInstance({ componentId: 20, percentage: 12, amount: 0 }),
        ]);
        SC.findByPk
            .mockResolvedValueOnce(mockInstance({ id: 10, type: 'EARNING', calcType: 'PERCENTAGE' }))
            .mockResolvedValueOnce(mockInstance({ id: 20, type: 'DEDUCTION', calcType: 'PERCENTAGE' }));
        PS.create.mockResolvedValue(mockInstance({ id: 99 }));
        PD.bulkCreate.mockResolvedValue([]);

        await payrollRunService.process(1, 7);

        expect(PS.create).toHaveBeenCalled();
        expect(PD.bulkCreate).toHaveBeenCalled();
        expect(runInst.update).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'COMPLETED', processedBy: 7 }),
            expect.any(Object),
        );
    });

    it('process wipes existing payslips before regenerating', async () => {
        PR.findByPk.mockResolvedValue(mockInstance({ id: 1, status: 'DRAFT' }));
        PS.findAll.mockResolvedValue([mockInstance({ id: 100 })]);
        ES.findAll.mockResolvedValue([]);

        await payrollRunService.process(1, 7);

        expect(SD.destroy).toHaveBeenCalled();
        expect(PD.destroy).toHaveBeenCalled();
        expect(PS.destroy).toHaveBeenCalled();
    });

    it('lock rejects non-completed', async () => {
        PR.findByPk.mockResolvedValue(mockInstance({ id: 1, status: 'DRAFT' }));
        await expect(payrollRunService.lock(1)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('lock updates status when completed', async () => {
        const inst = mockInstance({ id: 1, status: 'COMPLETED' });
        PR.findByPk.mockResolvedValue(inst);
        await payrollRunService.lock(1);
        expect(inst.update).toHaveBeenCalledWith({ status: 'LOCKED' });
    });
});
