import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({ LeaveBalance: mockModel() }));

import { leaveBalanceService } from './leaveBalance.service';
import { LeaveBalance } from '../models';
const LB = LeaveBalance as unknown as ReturnType<typeof mockModel>;

describe('leaveBalanceService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        LB.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(leaveBalanceService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        LB.findByPk.mockResolvedValue(null);
        await expect(leaveBalanceService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields and computes balance = allocated - used', async () => {
        await expect(leaveBalanceService.create({})).rejects.toMatchObject({ statusCode: 400 });
        LB.create.mockResolvedValue(mockInstance({ id: 1 }));
        await leaveBalanceService.create({ employeeId: 1, leaveTypeId: 2, year: 2026, allocated: 12, used: 3 });
        expect(LB.create).toHaveBeenCalledWith(expect.objectContaining({ balance: 9 }));
    });

    it('update recomputes balance based on merged fields', async () => {
        const inst = mockInstance({ id: 1, allocated: 12, used: 0 });
        LB.findByPk.mockResolvedValue(inst);
        await leaveBalanceService.update(1, { used: 5 });
        expect(inst.update).toHaveBeenCalledWith(expect.objectContaining({ balance: 7 }));
    });

    it('remove + byEmployee delegate to model', async () => {
        const inst = mockInstance({ id: 1 });
        LB.findByPk.mockResolvedValue(inst);
        await leaveBalanceService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();

        LB.findAll.mockResolvedValue([]);
        await leaveBalanceService.byEmployee(1, 2026);
        expect(LB.findAll).toHaveBeenCalledWith({ where: { employeeId: 1, year: 2026 } });
    });
});
