import { mockModel, mockInstance, mockSequelize } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    sequelize: mockSequelize(),
    LeaveRequest: mockModel(),
    LeaveBalance: mockModel(),
    Employee: mockModel(),
    LeaveType: mockModel(),
}));

import { leaveRequestService } from './leaveRequest.service';
import { LeaveRequest, LeaveBalance, Employee, LeaveType, sequelize } from '../models';
const LR = LeaveRequest as unknown as ReturnType<typeof mockModel>;
const LB = LeaveBalance as unknown as ReturnType<typeof mockModel>;
const Emp = Employee as unknown as ReturnType<typeof mockModel>;
const LT = LeaveType as unknown as ReturnType<typeof mockModel>;
const db = sequelize as unknown as { transaction: jest.Mock };

describe('leaveRequestService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        db.transaction.mockImplementation(async (callback: (transaction: object) => unknown) => callback({}));
    });

    it('list returns count + rows', async () => {
        LR.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(leaveRequestService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('create requires all FK fields and computes days', async () => {
        await expect(leaveRequestService.create({})).rejects.toMatchObject({ statusCode: 400 });

        Emp.findByPk.mockResolvedValue(null);
        await expect(
            leaveRequestService.create({ employeeId: 9, leaveTypeId: 1, fromDate: '2026-05-01', toDate: '2026-05-02' }),
        ).rejects.toMatchObject({ statusCode: 400 });

        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        LT.findByPk.mockResolvedValue(null);
        await expect(
            leaveRequestService.create({ employeeId: 1, leaveTypeId: 9, fromDate: '2026-05-01', toDate: '2026-05-02' }),
        ).rejects.toMatchObject({ statusCode: 400 });

        LT.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        LR.create.mockResolvedValue(mockInstance({ id: 1 }));
        await leaveRequestService.create({
            employeeId: 1,
            leaveTypeId: 1,
            fromDate: '2026-05-01',
            toDate: '2026-05-03',
        });
        expect(LR.create).toHaveBeenCalledWith(expect.objectContaining({ days: 3, status: 'PENDING' }));
    });

    it('approve rejects non-pending requests', async () => {
        LR.findByPk.mockResolvedValue(mockInstance({ id: 1, status: 'APPROVED' }));
        await expect(leaveRequestService.approve(1, 7)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('approve updates request and decrements balance', async () => {
        const reqInst = mockInstance({
            id: 1,
            status: 'PENDING',
            employeeId: 5,
            leaveTypeId: 2,
            fromDate: '2026-05-01',
            days: 2,
        });
        LR.findByPk.mockResolvedValue(reqInst);
        const balInst = mockInstance({ id: 1, used: 0, allocated: 10 });
        LB.findOne.mockResolvedValue(balInst);

        await leaveRequestService.approve(1, 7);

        expect(reqInst.update).toHaveBeenCalledWith({ status: 'APPROVED', approvedBy: 7 }, expect.any(Object));
        expect(balInst.update).toHaveBeenCalledWith({ used: 2, balance: 8 }, expect.any(Object));
    });

    it('reject 400s when not pending and updates when pending', async () => {
        LR.findByPk.mockResolvedValue(mockInstance({ id: 1, status: 'APPROVED' }));
        await expect(leaveRequestService.reject(1, 1)).rejects.toMatchObject({ statusCode: 400 });

        const inst = mockInstance({ id: 1, status: 'PENDING' });
        LR.findByPk.mockResolvedValue(inst);
        await leaveRequestService.reject(1, 7);
        expect(inst.update).toHaveBeenCalledWith({ status: 'REJECTED', approvedBy: 7 });
    });

    it('cancel restores balance only when previously approved', async () => {
        const reqInst = mockInstance({
            id: 1,
            status: 'APPROVED',
            employeeId: 5,
            leaveTypeId: 2,
            fromDate: '2026-05-01',
            days: 2,
        });
        LR.findByPk.mockResolvedValue(reqInst);
        const balInst = mockInstance({ id: 1, used: 2, allocated: 10 });
        LB.findOne.mockResolvedValue(balInst);

        await leaveRequestService.cancel(1);

        expect(reqInst.update).toHaveBeenCalledWith({ status: 'CANCELLED' }, expect.any(Object));
        expect(balInst.update).toHaveBeenCalledWith({ used: 0, balance: 10 }, expect.any(Object));
    });

    it('listWithRelations includes employee/leaveType/approver associations', async () => {
        LR.findAll.mockResolvedValue([]);
        await leaveRequestService.listWithRelations({ limit: 10, offset: 0 });
        expect(LR.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                include: expect.arrayContaining([
                    expect.objectContaining({ association: 'employee' }),
                    expect.objectContaining({ association: 'leaveType' }),
                    expect.objectContaining({ association: 'approver' }),
                ]),
            }),
        );
    });
});
