import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    SalaryStructureComponent: mockModel(),
    SalaryStructure: mockModel(),
    SalaryComponent: mockModel(),
}));

import { salaryStructureComponentService } from './salaryStructureComponent.service';
import { SalaryStructureComponent, SalaryStructure, SalaryComponent } from '../models';
const SSC = SalaryStructureComponent as unknown as ReturnType<typeof mockModel>;
const SS = SalaryStructure as unknown as ReturnType<typeof mockModel>;
const SC = SalaryComponent as unknown as ReturnType<typeof mockModel>;

describe('salaryStructureComponentService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list filters by structureId when given', async () => {
        SSC.findAll.mockResolvedValue([]);
        await salaryStructureComponentService.list({ structureId: 1 });
        expect(SSC.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { structureId: 1 } }));
    });

    it('getById 404s when missing', async () => {
        SSC.findByPk.mockResolvedValue(null);
        await expect(salaryStructureComponentService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create validates FKs and persists', async () => {
        await expect(salaryStructureComponentService.create({})).rejects.toMatchObject({ statusCode: 400 });

        SS.findByPk.mockResolvedValue(null);
        await expect(salaryStructureComponentService.create({ structureId: 9, componentId: 1 })).rejects.toMatchObject({
            statusCode: 400,
        });

        SS.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        SC.findByPk.mockResolvedValue(null);
        await expect(salaryStructureComponentService.create({ structureId: 1, componentId: 9 })).rejects.toMatchObject({
            statusCode: 400,
        });

        SC.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        SSC.create.mockResolvedValue(mockInstance({ id: 1 }));
        await salaryStructureComponentService.create({ structureId: 1, componentId: 1 });
        expect(SSC.create).toHaveBeenCalled();
    });

    it('update + remove delegate', async () => {
        const inst = mockInstance({ id: 1 });
        SSC.findByPk.mockResolvedValue(inst);
        await salaryStructureComponentService.update(1, { amount: 100 });
        expect(inst.update).toHaveBeenCalled();
        await salaryStructureComponentService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
