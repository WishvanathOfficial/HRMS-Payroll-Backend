import { mockModel, mockInstance } from '../__tests__/helpers/sequelize';

jest.mock('../models', () => ({
    AttendanceLog: mockModel(),
    Employee: mockModel(),
}));

import { attendanceLogService } from './attendanceLog.service';
import { AttendanceLog, Employee } from '../models';
const AL = AttendanceLog as unknown as ReturnType<typeof mockModel>;
const Emp = Employee as unknown as ReturnType<typeof mockModel>;

describe('attendanceLogService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list returns count + rows', async () => {
        AL.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
        await expect(attendanceLogService.list({ limit: 10, offset: 0 })).resolves.toEqual({ rows: [], total: 0 });
    });

    it('getById 404s when missing', async () => {
        AL.findByPk.mockResolvedValue(null);
        await expect(attendanceLogService.getById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('create requires employeeId + logDate and validates employee', async () => {
        await expect(attendanceLogService.create({})).rejects.toMatchObject({ statusCode: 400 });
        Emp.findByPk.mockResolvedValue(null);
        await expect(attendanceLogService.create({ employeeId: 9, logDate: '2024-01-01' })).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('checkIn rejects when already checked in', async () => {
        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        AL.findOne.mockResolvedValue(mockInstance({ id: 1, checkIn: '2024-01-01 09:00:00' }));
        await expect(attendanceLogService.checkIn(1)).rejects.toMatchObject({ statusCode: 409 });
    });

    it('checkIn creates a new log when none exists', async () => {
        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        AL.findOne.mockResolvedValue(null);
        AL.create.mockResolvedValue(mockInstance({ id: 1 }));
        await attendanceLogService.checkIn(1);
        expect(AL.create).toHaveBeenCalled();
    });

    it('checkIn updates existing log without checkIn', async () => {
        Emp.findByPk.mockResolvedValue(mockInstance({ id: 1 }));
        const inst = mockInstance({ id: 1, checkIn: null });
        AL.findOne.mockResolvedValue(inst);
        await attendanceLogService.checkIn(1);
        expect(inst.update).toHaveBeenCalled();
    });

    it('checkOut 404s when no row, 400s without checkIn, 409s when already checked-out', async () => {
        AL.findOne.mockResolvedValue(null);
        await expect(attendanceLogService.checkOut(1)).rejects.toMatchObject({ statusCode: 404 });

        AL.findOne.mockResolvedValue(mockInstance({ id: 1, checkIn: null }));
        await expect(attendanceLogService.checkOut(1)).rejects.toMatchObject({ statusCode: 400 });

        AL.findOne.mockResolvedValue(
            mockInstance({ id: 1, checkIn: '2024-01-01 09:00:00', checkOut: '2024-01-01 18:00:00' }),
        );
        await expect(attendanceLogService.checkOut(1)).rejects.toMatchObject({ statusCode: 409 });
    });

    it('checkOut updates work hours on a valid checkout', async () => {
        const inst = mockInstance({ id: 1, checkIn: '2024-01-01 09:00:00', checkOut: null });
        AL.findOne.mockResolvedValue(inst);
        await attendanceLogService.checkOut(1);
        expect(inst.update).toHaveBeenCalled();
    });

    it('summary aggregates statuses', async () => {
        AL.findAll.mockResolvedValue([
            mockInstance({ status: 'PRESENT', workHours: 9 }),
            mockInstance({ status: 'ABSENT', workHours: 0 }),
        ]);
        const out = await attendanceLogService.summary(1, 2026, 5);
        expect(out.present).toBe(1);
        expect(out.absent).toBe(1);
        expect(out.totalWorkHours).toBe(9);
    });
});
