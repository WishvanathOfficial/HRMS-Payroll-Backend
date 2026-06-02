import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';
import { ApiError } from '../utils/ApiError';

jest.mock('../models', () => ({
    Department: mockModel(),
    Designation: mockModel(),
    Employee: mockModel(),
}));

import { departmentService } from './department.service';
import { Department, Designation, Employee } from '../models';

const Dept = Department as unknown as ReturnType<typeof mockModel>;
const Desg = Designation as unknown as ReturnType<typeof mockModel>;
const Emp = Employee as unknown as ReturnType<typeof mockModel>;

describe('departmentService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns rows + total from findAndCountAll', async () => {
        Dept.findAndCountAll.mockResolvedValue({ rows: [{ id: 1 }], count: 1 });
        const out = await departmentService.list({ limit: 10, offset: 0 });
        expect(out).toEqual({ rows: [{ id: 1 }], total: 1 });
    });

    it('getById throws notFound when missing', async () => {
        Dept.findByPk.mockResolvedValue(null);
        await expect(departmentService.getById(99)).rejects.toBeInstanceOf(ApiError);
    });

    it('getById returns instance when found', async () => {
        const inst = mockInstance({ id: 1, name: 'Eng' });
        Dept.findByPk.mockResolvedValue(inst);
        await expect(departmentService.getById(1)).resolves.toBe(inst);
    });

    it('create rejects when name missing', async () => {
        await expect(departmentService.create({})).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create rejects when duplicate name exists', async () => {
        Dept.findOne.mockResolvedValue({ id: 9 });
        await expect(departmentService.create({ name: 'Eng' })).rejects.toMatchObject({ statusCode: 409 });
    });

    it('create persists via Department.create', async () => {
        Dept.findOne.mockResolvedValue(null);
        const created = mockInstance({ id: 1, name: 'Eng' });
        Dept.create.mockResolvedValue(created);
        const out = await departmentService.create({ name: 'Eng' });
        expect(Dept.create).toHaveBeenCalledWith({ name: 'Eng' });
        expect(out).toBe(created);
    });

    it('update calls instance.update', async () => {
        const inst = mockInstance({ id: 1, name: 'Eng' });
        Dept.findByPk.mockResolvedValue(inst);
        await departmentService.update(1, { name: 'New' });
        expect(inst.update).toHaveBeenCalledWith({ name: 'New' });
    });

    it('remove calls instance.destroy', async () => {
        const inst = mockInstance({ id: 1 });
        Dept.findByPk.mockResolvedValue(inst);
        await departmentService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();
    });

    it('listEmployees queries Employee with departmentId', async () => {
        Dept.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Emp.findAll.mockResolvedValue([{ id: 7 }]);
        const out = await departmentService.listEmployees(1);
        expect(Emp.findAll).toHaveBeenCalledWith({ where: { departmentId: 1 } });
        expect(out).toEqual([{ id: 7 }]);
    });

    it('listDesignations queries Designation with departmentId', async () => {
        Dept.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Desg.findAll.mockResolvedValue([{ id: 3 }]);
        const out = await departmentService.listDesignations(1);
        expect(Desg.findAll).toHaveBeenCalledWith({ where: { departmentId: 1 } });
        expect(out).toEqual([{ id: 3 }]);
    });

    it('listChildren queries Department with parentDeptId', async () => {
        Dept.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Dept.findAll.mockResolvedValue([{ id: 6, parentDeptId: 1 }]);
        const out = await departmentService.listChildren(1);
        expect(Dept.findAll).toHaveBeenCalledWith({ where: { parentDeptId: 1 } });
        expect(out).toEqual([{ id: 6, parentDeptId: 1 }]);
    });

    it('withRelations 404s when missing', async () => {
        Dept.findByPk.mockResolvedValue(null);
        await expect(departmentService.withRelations(99)).rejects.toMatchObject({ statusCode: 404 });
    });
});
