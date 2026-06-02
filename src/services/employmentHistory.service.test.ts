import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    EmploymentHistory: mockModel(),
    Employee: mockModel(),
}));

import { employmentHistoryService } from './employmentHistory.service';
import { EmploymentHistory, Employee } from '../models';
const EH = EmploymentHistory as unknown as ReturnType<typeof mockModel>;
const Emp = Employee as unknown as ReturnType<typeof mockModel>;

describe('employmentHistoryService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns rows + total', async () => {
        EH.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(employmentHistoryService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        EH.findByPk.mockResolvedValue(null);
        await expect(employmentHistoryService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires employeeId + effectiveFrom and validates employee', async () => {
        await expect(employmentHistoryService.create({})).rejects.toMatchObject({ statusCode: 400 });
        await expect(employmentHistoryService.create({ employeeId: 1 })).rejects.toMatchObject({ statusCode: 400 });
        Emp.findByPk.mockResolvedValue(null);
        await expect(
            employmentHistoryService.create({ employeeId: 99, effectiveFrom: '2024-01-01' }),
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create persists when valid', async () => {
        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        EH.create.mockResolvedValue(mockInstance({ id: 5 }));
        await employmentHistoryService.create({ employeeId: 1, effectiveFrom: '2024-01-01' });
        expect(EH.create).toHaveBeenCalled();
    });

    it('update + remove delegate to instance', async () => {
        const inst = mockInstance({ id: 1 });
        EH.findByPk.mockResolvedValue(inst);
        await employmentHistoryService.update(1, { reason: 'x' });
        expect(inst.update).toHaveBeenCalled();
        await employmentHistoryService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });

    it('byEmployee queries with employeeId', async () => {
        EH.findAll.mockResolvedValue([]);
        await employmentHistoryService.byEmployee(7);
        expect(EH.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { employeeId: 7 } }));
    });
});
