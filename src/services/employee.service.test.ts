import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    Employee: mockModel(),
    Department: mockModel(),
    Designation: mockModel(),
}));

import { employeeService } from './employee.service';
import { Employee, Department, Designation } from '../models';
const Emp = Employee as unknown as ReturnType<typeof mockModel>;
const Dept = Department as unknown as ReturnType<typeof mockModel>;
const Desg = Designation as unknown as ReturnType<typeof mockModel>;

const payload = {
    empCode: 'E1',
    firstName: 'A',
    lastName: 'B',
    email: 'a@b.com',
    joinDate: '2024-01-01',
};

describe('employeeService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns rows + total', async () => {
        Emp.findAndCountAll.mockResolvedValue({ rows: [{ id: 1 }], count: 1 });
        await expect(employeeService.list({ limit: 10, offset: 0 })).resolves.toEqual({
            rows: [{ id: 1 }],
            total: 1,
        });
    });

    it('getById 404s when missing', async () => {
        Emp.findByPk.mockResolvedValue(null);
        await expect(employeeService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('getByEmpCode 404s when missing', async () => {
        Emp.findOne.mockResolvedValue(null);
        await expect(employeeService.getByEmpCode('X')).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create rejects when required fields missing', async () => {
        await expect(employeeService.create({})).rejects.toMatchObject({ statusCode: 400 });
    });

    it('create 409s when email/empCode exist', async () => {
        Emp.findOne.mockResolvedValue({ id: 1 });
        await expect(employeeService.create(payload)).rejects.toMatchObject({ statusCode: 409 });
    });

    it('create validates departmentId / designationId / reportingTo existence', async () => {
        Emp.findOne.mockResolvedValue(null);
        Dept.findByPk.mockResolvedValue(null);
        await expect(employeeService.create({ ...payload, departmentId: 9 })).rejects.toMatchObject({
            statusCode: 400,
        });

        Dept.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        Desg.findByPk.mockResolvedValue(null);
        await expect(employeeService.create({ ...payload, departmentId: 1, designationId: 9 })).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('create persists when valid', async () => {
        Emp.findOne.mockResolvedValue(null);
        const created = mockInstance({ id: 1, ...payload });
        Emp.create.mockResolvedValue(created);
        const out = await employeeService.create(payload);
        expect(Emp.create).toHaveBeenCalled();
        expect(out).toBe(created);
    });

    it('update + remove + getReportees + setStatus all delegate correctly', async () => {
        const inst = mockInstance({ id: 1, status: 'ACTIVE' });
        Emp.findByPk.mockResolvedValue(inst);

        await employeeService.update(1, { firstName: 'New' });
        expect(inst.update).toHaveBeenCalledWith({ firstName: 'New' });

        await employeeService.remove(1);
        expect(inst.destroy).toHaveBeenCalled();

        Emp.findByPk.mockResolvedValue(inst);
        Emp.findAll.mockResolvedValue([{ id: 2 }]);
        await expect(employeeService.getReportees(1)).resolves.toEqual([{ id: 2 }]);

        Emp.findByPk.mockResolvedValue(inst);
        await employeeService.setStatus(1, 'INACTIVE');
        expect(inst.update).toHaveBeenCalledWith({ status: 'INACTIVE' });
    });

    it('setStatus rejects empty status', async () => {
        await expect(employeeService.setStatus(1, '' as never)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('fullProfile 404s when missing', async () => {
        Emp.findByPk.mockResolvedValue(null);
        await expect(employeeService.fullProfile(99)).rejects.toMatchObject({ statusCode: 404 });
    });
});
