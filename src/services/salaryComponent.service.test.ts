import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({ SalaryComponent: mockModel() }));

import { salaryComponentService } from './salaryComponent.service';
import { SalaryComponent } from '../models';
const SC = SalaryComponent as unknown as ReturnType<typeof mockModel>;

describe('salaryComponentService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by type when given', async () => {
        SC.findAll.mockResolvedValue([]);
        await salaryComponentService.list({ type: 'EARNING' });
        expect(SC.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { type: 'EARNING' } }));
    });

    it('getById 404s when missing', async () => {
        SC.findByPk.mockResolvedValue(null);
        await expect(salaryComponentService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires fields + rejects duplicates', async () => {
        await expect(salaryComponentService.create({})).rejects.toMatchObject({ statusCode: 400 });
        SC.findOne.mockResolvedValue({ id: 1 });
        await expect(
            salaryComponentService.create({ name: 'Basic', type: 'EARNING', calcType: 'PERCENTAGE' }),
        ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('create persists when valid', async () => {
        SC.findOne.mockResolvedValue(null);
        SC.create.mockResolvedValue(mockInstance({ id: 1 }));
        await salaryComponentService.create({ name: 'Basic', type: 'EARNING', calcType: 'PERCENTAGE' });
        expect(SC.create).toHaveBeenCalled();
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        SC.findByPk.mockResolvedValue(inst);
        await salaryComponentService.update(1, { value: 10 });
        expect(inst.update).toHaveBeenCalled();
        await salaryComponentService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
