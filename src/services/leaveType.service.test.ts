import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({ LeaveType: mockModel() }));

import { leaveTypeService } from './leaveType.service';
import { LeaveType } from '../models';
const LT = LeaveType as unknown as ReturnType<typeof mockModel>;

describe('leaveTypeService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns findAll result', async () => {
        LT.findAll.mockResolvedValue([{ id: 1 }]);
        await expect(leaveTypeService.list()).resolves.toEqual([{ id: 1 }]);
    });

    it('getById 404s when missing', async () => {
        LT.findByPk.mockResolvedValue(null);
        await expect(leaveTypeService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires name + rejects duplicates', async () => {
        await expect(leaveTypeService.create({})).rejects.toMatchObject({ statusCode: 400 });
        LT.findOne.mockResolvedValue({ id: 1 });
        await expect(leaveTypeService.create({ name: 'CL' })).rejects.toMatchObject({ statusCode: 409 });
    });

    it('create persists when valid', async () => {
        LT.findOne.mockResolvedValue(null);
        LT.create.mockResolvedValue(mockInstance({ id: 1 }));
        await leaveTypeService.create({ name: 'CL' });
        expect(LT.create).toHaveBeenCalled();
    });

    it('update + remove call instance', async () => {
        const inst = mockInstance({ id: 1 });
        LT.findByPk.mockResolvedValue(inst);
        await leaveTypeService.update(1, { name: 'New' });
        expect(inst.update).toHaveBeenCalled();
        await leaveTypeService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
