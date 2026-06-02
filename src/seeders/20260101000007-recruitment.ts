import { QueryInterface } from 'sequelize';

export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();
        await queryInterface.bulkInsert(
            'JobPostings',
            [
                {
                    Id: 1,
                    DesignationId: 1,
                    DepartmentId: 6,
                    Openings: 3,
                    Status: 'OPEN',
                    PostedOn: '2026-04-01',
                    ClosesOn: '2026-06-30',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    DesignationId: 4,
                    DepartmentId: 7,
                    Openings: 2,
                    Status: 'OPEN',
                    PostedOn: '2026-04-15',
                    ClosesOn: '2026-06-15',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 3,
                    DesignationId: 8,
                    DepartmentId: 4,
                    Openings: 5,
                    Status: 'OPEN',
                    PostedOn: '2026-03-20',
                    ClosesOn: '2026-05-31',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert(
            'Applicants',
            [
                {
                    Id: 1,
                    JobPostingId: 1,
                    Name: 'Rahul Mishra',
                    Email: 'rahul.m@mail.com',
                    Phone: '9000000001',
                    ResumeUrl: 'https://example.com/resume/rahul.pdf',
                    Status: 'INTERVIEW',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    JobPostingId: 1,
                    Name: 'Priyanka Gupta',
                    Email: 'priyanka.g@mail.com',
                    Phone: '9000000002',
                    ResumeUrl: 'https://example.com/resume/priyanka.pdf',
                    Status: 'APPLIED',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 3,
                    JobPostingId: 2,
                    Name: 'Saurav Roy',
                    Email: 'saurav.r@mail.com',
                    Phone: '9000000003',
                    ResumeUrl: 'https://example.com/resume/saurav.pdf',
                    Status: 'SHORTLISTED',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 4,
                    JobPostingId: 3,
                    Name: 'Neha Kapoor',
                    Email: 'neha.k@mail.com',
                    Phone: '9000000004',
                    ResumeUrl: 'https://example.com/resume/neha.pdf',
                    Status: 'OFFERED',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert(
            'InterviewStages',
            [
                {
                    ApplicantId: 1,
                    Stage: 'Screening',
                    ScheduledOn: '2026-04-25',
                    InterviewerId: 5,
                    Result: 'PASSED',
                    Feedback: 'Good communication',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    ApplicantId: 1,
                    Stage: 'Technical',
                    ScheduledOn: '2026-05-02',
                    InterviewerId: 2,
                    Result: 'PASSED',
                    Feedback: 'Solid fundamentals',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    ApplicantId: 3,
                    Stage: 'Screening',
                    ScheduledOn: '2026-04-22',
                    InterviewerId: 5,
                    Result: 'PASSED',
                    Feedback: 'Strong portfolio',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    ApplicantId: 4,
                    Stage: 'Final Round',
                    ScheduledOn: '2026-04-18',
                    InterviewerId: 1,
                    Result: 'PASSED',
                    Feedback: 'Strong fit, offered',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('InterviewStages', {}, { transaction });
        await queryInterface.bulkDelete('Applicants', {}, { transaction });
        await queryInterface.bulkDelete('JobPostings', {}, { transaction });
    });
