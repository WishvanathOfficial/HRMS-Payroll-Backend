import { QueryInterface } from 'sequelize';

export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();
        await queryInterface.bulkInsert(
            'AppraisalCycles',
            [
                {
                    Id: 1,
                    Name: 'H1 2026 Review',
                    StartDate: '2026-01-01',
                    EndDate: '2026-06-30',
                    Status: 'ACTIVE',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    Name: 'Annual 2025 Review',
                    StartDate: '2025-01-01',
                    EndDate: '2025-12-31',
                    Status: 'CLOSED',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert(
            'EmployeeAppraisals',
            [
                {
                    CycleId: 2,
                    EmployeeId: 1,
                    SelfRating: 4.5,
                    ManagerRating: 4.6,
                    FinalRating: 4.55,
                    Comments: 'Excellent leadership',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    CycleId: 2,
                    EmployeeId: 2,
                    SelfRating: 4.2,
                    ManagerRating: 4.0,
                    FinalRating: 4.1,
                    Comments: 'Strong delivery on critical projects',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    CycleId: 2,
                    EmployeeId: 3,
                    SelfRating: 3.8,
                    ManagerRating: 3.9,
                    FinalRating: 3.85,
                    Comments: 'Consistent performer',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    CycleId: 2,
                    EmployeeId: 4,
                    SelfRating: 4.0,
                    ManagerRating: 3.8,
                    FinalRating: 3.9,
                    Comments: 'Improved significantly in design',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    CycleId: 1,
                    EmployeeId: 5,
                    SelfRating: 4.5,
                    ManagerRating: 0,
                    FinalRating: 0,
                    Comments: 'In progress',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('EmployeeAppraisals', {}, { transaction });
        await queryInterface.bulkDelete('AppraisalCycles', {}, { transaction });
    });
