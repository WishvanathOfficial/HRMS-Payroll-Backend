import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    EmployeeShift: mockModel(),
    Employee: mockModel(),
    Shift: mockModel(),
}));

import { employeeShiftService } from './employeeShift.service';
import { EmployeeShift, Employee, Shift } from '../models';
const ES = EmployeeShift as unknown as ReturnType<typeof mockModel>;
const Emp = Employee as unknown as ReturnType<typeof mockModel>;
const S = Shift as unknown as ReturnType<typeof mockModel>;

describe('employeeShiftService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        ES.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(employeeShiftService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        ES.findByPk.mockResolvedValue(null);
        await expect(employeeShiftService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields + validates FKs', async () => {
        await expect(employeeShiftService.create({})).rejects.toMatchObject({ statusCode: 400 });
        Emp.findByPk.mockResolvedValue(null);
        await expect(
            employeeShiftService.create({ employeeId: 9, shiftId: 1, effectiveFrom: '2024-01-01' }),
        ).rejects.toMatchObject({ statusCode: 400 });

        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        S.findByPk.mockResolvedValue(null);
        await expect(
            employeeShiftService.create({ employeeId: 1, shiftId: 9, effectiveFrom: '2024-01-01' }),
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create persists when valid', async () => {
        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        S.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        ES.create.mockResolvedValue(mockInstance({ id: 1 }));
        await employeeShiftService.create({ employeeId: 1, shiftId: 1, effectiveFrom: '2024-01-01' });
        expect(ES.create).toHaveBeenCalled();
    });

    it('update + remove delegate to instance', async () => {
        const inst = mockInstance({ id: 1 });
        ES.findByPk.mockResolvedValue(inst);
        await employeeShiftService.update(1, { effectiveTo: '2024-12-31' });
        expect(inst.update).toHaveBeenCalled();
        await employeeShiftService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });

    it('currentByEmployee + historyByEmployee query models', async () => {
        ES.findOne.mockResolvedValue(null);
        await employeeShiftService.currentByEmployee(1);
        expect(ES.findOne).toHaveBeenCalled();

        ES.findAll.mockResolvedValue([]);
        await employeeShiftService.historyByEmployee(1);
        expect(ES.findAll).toHaveBeenCalled();
    });
});
