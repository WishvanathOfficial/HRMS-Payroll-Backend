import { QueryInterface } from 'sequelize';

export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();
        await queryInterface.bulkInsert(
            'LeaveTypes',
            [
                {
                    Id: 1,
                    Name: 'Casual Leave',
                    DaysAllowed: 12,
                    IsPaid: true,
                    CarryForward: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    Name: 'Sick Leave',
                    DaysAllowed: 10,
                    IsPaid: true,
                    CarryForward: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 3,
                    Name: 'Earned Leave',
                    DaysAllowed: 18,
                    IsPaid: true,
                    CarryForward: true,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 4,
                    Name: 'Maternity Leave',
                    DaysAllowed: 180,
                    IsPaid: true,
                    CarryForward: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 5,
                    Name: 'Unpaid Leave',
                    DaysAllowed: 0,
                    IsPaid: false,
                    CarryForward: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        const year = new Date().getFullYear();
        const employeeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const leaveTypes = [
            { id: 1, allocated: 12 },
            { id: 2, allocated: 10 },
            { id: 3, allocated: 18 },
        ];
        const balances: Record<string, unknown>[] = [];
        for (const empId of employeeIds) {
            for (const lt of leaveTypes) {
                balances.push({
                    EmployeeId: empId,
                    LeaveTypeId: lt.id,
                    Year: year,
                    Allocated: lt.allocated,
                    Used: 0,
                    Balance: lt.allocated,
                    CreatedOn: now,
                    UpdatedOn: now,
                });
            }
        }
        await queryInterface.bulkInsert('LeaveBalances', balances, { transaction });

        await queryInterface.bulkInsert(
            'LeaveRequests',
            [
                {
                    EmployeeId: 3,
                    LeaveTypeId: 1,
                    FromDate: '2026-04-10',
                    ToDate: '2026-04-11',
                    Days: 2,
                    Reason: 'Family event',
                    Status: 'APPROVED',
                    ApprovedBy: 2,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 4,
                    LeaveTypeId: 2,
                    FromDate: '2026-05-02',
                    ToDate: '2026-05-03',
                    Days: 2,
                    Reason: 'Fever',
                    Status: 'APPROVED',
                    ApprovedBy: 1,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 10,
                    LeaveTypeId: 1,
                    FromDate: '2026-05-20',
                    ToDate: '2026-05-20',
                    Days: 1,
                    Reason: 'Personal work',
                    Status: 'PENDING',
                    ApprovedBy: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('LeaveRequests', {}, { transaction });
        await queryInterface.bulkDelete('LeaveBalances', {}, { transaction });
        await queryInterface.bulkDelete('LeaveTypes', {}, { transaction });
    });
