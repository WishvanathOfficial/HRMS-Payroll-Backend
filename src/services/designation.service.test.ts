import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    Designation: mockModel(),
    Department: mockModel(),
}));

import { designationService } from './designation.service';
import { Designation, Department } from '../models';
const Desg = Designation as unknown as ReturnType<typeof mockModel>;
const Dept = Department as unknown as ReturnType<typeof mockModel>;

describe('designationService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        Desg.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(designationService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404 when missing', async () => {
        Desg.findByPk.mockResolvedValue(null);
        await expect(designationService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires title + departmentId', async () => {
        await expect(designationService.create({})).rejects.toMatchObject({ statusCode: 400 });
        await expect(designationService.create({ title: 'X' })).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create fails when department does not exist', async () => {
        Dept.findByPk.mockResolvedValue(null);
        await expect(designationService.create({ title: 'X', departmentId: 99 })).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('create persists when valid', async () => {
        Dept.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Desg.create.mockResolvedValue(mockInstance({ id: 5, title: 'X', departmentId: 1 }));
        await designationService.create({ title: 'X', departmentId: 1 });
        expect(Desg.create).toHaveBeenCalled();
    });

    it('update + remove call instance methods', async () => {
        const inst = mockInstance({ id: 1, title: 'X' });
        Desg.findByPk.mockResolvedValue(inst);
        await designationService.update(1, { title: 'Y' });
        expect(inst.update).toHaveBeenCalled();
        await designationService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });

    it('listWithDepartment includes the department association', async () => {
        Desg.findAll.mockResolvedValue([]);
        await designationService.listWithDepartment({ limit: 10, offset: 0 });
        expect(Desg.findAll).toHaveBeenCalledWith(
            expect.objectContaining({ include: [{ association: 'department' }] }),
        );
    });
});
