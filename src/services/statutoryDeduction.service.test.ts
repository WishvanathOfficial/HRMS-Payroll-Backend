import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    StatutoryDeduction: mockModel(),
    Payslip: mockModel(),
}));

import { statutoryDeductionService } from './statutoryDeduction.service';
import { StatutoryDeduction, Payslip } from '../models';
const SD = StatutoryDeduction as unknown as ReturnType<typeof mockModel>;
const P = Payslip as unknown as ReturnType<typeof mockModel>;

describe('statutoryDeductionService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by payslipId / type', async () => {
        SD.findAll.mockResolvedValue([]);
        await statutoryDeductionService.list({ payslipId: 1, type: 'PF' });
        expect(SD.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { payslipId: 1, type: 'PF' } }));
    });

    it('getById 404s when missing', async () => {
        SD.findByPk.mockResolvedValue(null);
        await expect(statutoryDeductionService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields + validates payslip', async () => {
        await expect(statutoryDeductionService.create({})).rejects.toMatchObject({ statusCode: 400 });
        P.findByPk.mockResolvedValue(null);
        await expect(statutoryDeductionService.create({ payslipId: 9, type: 'PF' })).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('create persists when valid', async () => {
        P.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        SD.create.mockResolvedValue(mockInstance({ id: 1 }));
        await statutoryDeductionService.create({ payslipId: 1, type: 'PF' });
        expect(SD.create).toHaveBeenCalled();
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        SD.findByPk.mockResolvedValue(inst);
        await statutoryDeductionService.update(1, { tdsAmount: 100 });
        expect(inst.update).toHaveBeenCalled();
        await statutoryDeductionService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
