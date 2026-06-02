import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    EmployeeSalary: mockModel(),
    Employee: mockModel(),
    SalaryStructure: mockModel(),
}));

import { employeeSalaryService } from './employeeSalary.service';
import { EmployeeSalary, Employee, SalaryStructure } from '../models';
const ESal = EmployeeSalary as unknown as ReturnType<typeof mockModel>;
const Emp = Employee as unknown as ReturnType<typeof mockModel>;
const SS = SalaryStructure as unknown as ReturnType<typeof mockModel>;

describe('employeeSalaryService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        ESal.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(employeeSalaryService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        ESal.findByPk.mockResolvedValue(null);
        await expect(employeeSalaryService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires FKs and validates them', async () => {
        await expect(employeeSalaryService.create({})).rejects.toMatchObject({ statusCode: 400 });

        Emp.findByPk.mockResolvedValue(null);
        await expect(
            employeeSalaryService.create({ employeeId: 9, structureId: 1, ctc: 1000, effectiveFrom: '2024-01-01' }),
        ).rejects.toMatchObject({ statusCode: 400 });

        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        SS.findByPk.mockResolvedValue(null);
        await expect(
            employeeSalaryService.create({ employeeId: 1, structureId: 9, ctc: 1000, effectiveFrom: '2024-01-01' }),
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create persists when valid', async () => {
        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        SS.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        ESal.create.mockResolvedValue(mockInstance({ id: 1 }));
        await employeeSalaryService.create({ employeeId: 1, structureId: 1, ctc: 1000, effectiveFrom: '2024-01-01' });
        expect(ESal.create).toHaveBeenCalled();
    });

    it('update + remove + currentByEmployee delegate', async () => {
        const inst = mockInstance({ id: 1 });
        ESal.findByPk.mockResolvedValue(inst);
        await employeeSalaryService.update(1, { ctc: 2000 });
        expect(inst.update).toHaveBeenCalled();
        await employeeSalaryService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();

        ESal.findOne.mockResolvedValue(inst);
        await employeeSalaryService.currentByEmployee(1);
        expect(ESal.findOne).toHaveBeenCalled();
    });
});
