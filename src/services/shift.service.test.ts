import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({ Shift: mockModel() }));

import { shiftService } from './shift.service';
import { Shift } from '../models';
const S = Shift as unknown as ReturnType<typeof mockModel>;

describe('shiftService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        S.findAndCountAll.mockResolvedValue({ rows: [{ id: 1 }], count: 1 });
        await expect(shiftService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [{ id: 1 }], total: 1 });
    });

    it('getById 404s when missing', async () => {
        S.findByPk.mockResolvedValue(null);
        await expect(shiftService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires name + start_time + end_time', async () => {
        await expect(shiftService.create({})).rejects.toMatchObject({ statusCode: 400 });
        await expect(shiftService.create({ name: 'X' })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create persists when valid', async () => {
        S.create.mockResolvedValue(mockInstance({ id: 1 }));
        await shiftService.create({ name: 'X', startTime: '09:00', endTime: '18:00' });
        expect(S.create).toHaveBeenCalled();
    });

    it('update + remove delegate to instance', async () => {
        const inst = mockInstance({ id: 1 });
        S.findByPk.mockResolvedValue(inst);
        await shiftService.update(1, { name: 'Y' });
        expect(inst.update).toHaveBeenCalled();
        await shiftService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });
});
