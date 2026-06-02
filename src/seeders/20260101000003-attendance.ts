import { QueryInterface } from 'sequelize';

export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();
        await queryInterface.bulkInsert(
            'Shifts',
            [
                {
                    Id: 1,
                    Name: 'General Day',
                    StartTime: '09:00:00',
                    EndTime: '18:00:00',
                    WeeklyOffDay: 0,
                    OvertimeMultiplier: 1.5,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    Name: 'Morning Shift',
                    StartTime: '06:00:00',
                    EndTime: '14:00:00',
                    WeeklyOffDay: 0,
                    OvertimeMultiplier: 1.5,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 3,
                    Name: 'Evening Shift',
                    StartTime: '14:00:00',
                    EndTime: '22:00:00',
                    WeeklyOffDay: 0,
                    OvertimeMultiplier: 1.75,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 4,
                    Name: 'Night Shift',
                    StartTime: '22:00:00',
                    EndTime: '06:00:00',
                    WeeklyOffDay: 0,
                    OvertimeMultiplier: 2.0,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        const employeeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        await queryInterface.bulkInsert(
            'EmployeeShifts',
            employeeIds.map((empId, i) => ({
                EmployeeId: empId,
                ShiftId: 1 + (i % 4),
                EffectiveFrom: '2024-01-01',
                EffectiveTo: null,
                CreatedOn: now,
                UpdatedOn: now,
            })),
            { transaction },
        );

        // Last 5 working days of attendance for each employee
        const today = new Date();
        const logs: Record<string, unknown>[] = [];
        for (let d = 1; d <= 5; d++) {
            const date = new Date(today);
            date.setDate(today.getDate() - d);
            const yyyy = date.toISOString().slice(0, 10);
            for (const empId of employeeIds) {
                logs.push({
                    EmployeeId: empId,
                    LogDate: yyyy,
                    CheckIn: `${yyyy} 09:05:00`,
                    CheckOut: `${yyyy} 18:10:00`,
                    WorkHours: 9,
                    Status: 'PRESENT',
                    Source: 'BIOMETRIC',
                    CreatedOn: now,
                    UpdatedOn: now,
                });
            }
        }
        await queryInterface.bulkInsert('AttendanceLogs', logs, { transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('AttendanceLogs', {}, { transaction });
        await queryInterface.bulkDelete('EmployeeShifts', {}, { transaction });
        await queryInterface.bulkDelete('Shifts', {}, { transaction });
    });
