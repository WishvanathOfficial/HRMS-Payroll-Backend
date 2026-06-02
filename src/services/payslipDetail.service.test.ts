import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    PayslipDetail: mockModel(),
    Payslip: mockModel(),
    SalaryComponent: mockModel(),
}));

import { payslipDetailService } from './payslipDetail.service';
import { PayslipDetail, Payslip, SalaryComponent } from '../models';
const PD = PayslipDetail as unknown as ReturnType<typeof mockModel>;
const PS = Payslip as unknown as ReturnType<typeof mockModel>;
const SC = SalaryComponent as unknown as ReturnType<typeof mockModel>;

describe('payslipDetailService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by payslipId when given', async () => {
        PD.findAll.mockResolvedValue([]);
        await payslipDetailService.list({ payslipId: 5 });
        expect(PD.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { payslipId: 5 } }));
    });

    it('getById 404s when missing', async () => {
        PD.findByPk.mockResolvedValue(null);
        await expect(payslipDetailService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create validates FKs and persists', async () => {
        await expect(payslipDetailService.create({})).rejects.toMatchObject({ statusCode: 400 });

        PS.findByPk.mockResolvedValue(null);
        await expect(
            payslipDetailService.create({ payslipId: 9, componentId: 1, componentType: 'EARNING' }),
        ).rejects.toMatchObject({ statusCode: 400 });

        PS.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        SC.findByPk.mockResolvedValue(null);
        await expect(
            payslipDetailService.create({ payslipId: 1, componentId: 9, componentType: 'EARNING' }),
        ).rejects.toMatchObject({ statusCode: 400 });

        SC.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        PD.create.mockResolvedValue(mockInstance({ id: 1 }));
        await payslipDetailService.create({ payslipId: 1, componentId: 1, componentType: 'EARNING' });
        expect(PD.create).toHaveBeenCalled();
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        PD.findByPk.mockResolvedValue(inst);
        await payslipDetailService.update(1, { amount: 500 });
        expect(inst.update).toHaveBeenCalled();
        await payslipDetailService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
