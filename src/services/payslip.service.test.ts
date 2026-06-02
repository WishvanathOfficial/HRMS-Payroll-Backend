import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({ Payslip: mockModel() }));

import { payslipService } from './payslip.service';
import { Payslip } from '../models';
const P = Payslip as unknown as ReturnType<typeof mockModel>;

describe('payslipService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        P.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(payslipService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        P.findByPk.mockResolvedValue(null);
        await expect(payslipService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires payrollRunId + employeeId', async () => {
        await expect(payslipService.create({})).rejects.toMatchObject({ statusCode: 400 });
    });

    it('detailed includes associations', async () => {
        P.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        await payslipService.detailed(1);
        expect(P.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({ include: expect.any(Array) }));
    });

    it('byEmployee filters by employeeId', async () => {
        P.findAll.mockResolvedValue([]);
        await payslipService.byEmployee(5);
        expect(P.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { employeeId: 5 } }));
    });

    it('markPaid updates status to PAID', async () => {
        const inst = mockInstance({ id: 1, status: 'GENERATED' });
        P.findByPk.mockResolvedValue(inst);
        await payslipService.markPaid(1);
        expect(inst.update).toHaveBeenCalledWith({ status: 'PAID' });
    });

    it('update + remove delegate to instance', async () => {
        const inst = mockInstance({ id: 1 });
        P.findByPk.mockResolvedValue(inst);
        await payslipService.update(1, { paidDays: 30 });
        expect(inst.update).toHaveBeenCalled();
        await payslipService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
