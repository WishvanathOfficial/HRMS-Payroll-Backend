import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    SalaryStructure: mockModel(),
    SalaryStructureComponent: mockModel(),
    SalaryComponent: mockModel(),
}));

import { salaryStructureService } from './salaryStructure.service';
import { SalaryStructure, SalaryStructureComponent } from '../models';
const SS = SalaryStructure as unknown as ReturnType<typeof mockModel>;
const SSC = SalaryStructureComponent as unknown as ReturnType<typeof mockModel>;

describe('salaryStructureService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns findAll', async () => {
        SS.findAll.mockResolvedValue([{ id: 1 }]);
        await expect(salaryStructureService.list()).resolves.toEqual([{ id: 1 }]);
    });

    it('getById 404s when missing', async () => {
        SS.findByPk.mockResolvedValue(null);
        await expect(salaryStructureService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires name + rejects duplicates', async () => {
        await expect(salaryStructureService.create({})).rejects.toMatchObject({ statusCode: 400 });
        SS.findOne.mockResolvedValue({ id: 1 });
        await expect(salaryStructureService.create({ name: 'Std' })).rejects.toMatchObject({ statusCode: 409 });
    });

    it('create persists when valid', async () => {
        SS.findOne.mockResolvedValue(null);
        SS.create.mockResolvedValue(mockInstance({ id: 1 }));
        await salaryStructureService.create({ name: 'Std' });
        expect(SS.create).toHaveBeenCalled();
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        SS.findByPk.mockResolvedValue(inst);
        await salaryStructureService.update(1, { name: 'X' });
        expect(inst.update).toHaveBeenCalled();
        await salaryStructureService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });

    it('withComponents joins structure + mappings', async () => {
        SS.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        SSC.findAll.mockResolvedValue([]);
        const out = await salaryStructureService.withComponents(1);
        expect(out).toHaveProperty('structure');
        expect(out).toHaveProperty('components');
    });
});
