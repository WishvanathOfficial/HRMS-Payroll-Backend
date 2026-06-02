import { QueryInterface } from 'sequelize';

export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();
        await queryInterface.bulkInsert(
            'Departments',
            [
                { Id: 1, Name: 'Engineering', ParentDeptId: null, ManagerId: null, CreatedOn: now, UpdatedOn: now },
                { Id: 2, Name: 'Human Resources', ParentDeptId: null, ManagerId: null, CreatedOn: now, UpdatedOn: now },
                { Id: 3, Name: 'Finance', ParentDeptId: null, ManagerId: null, CreatedOn: now, UpdatedOn: now },
                { Id: 4, Name: 'Sales', ParentDeptId: null, ManagerId: null, CreatedOn: now, UpdatedOn: now },
                { Id: 5, Name: 'Marketing', ParentDeptId: null, ManagerId: null, CreatedOn: now, UpdatedOn: now },
                { Id: 6, Name: 'Backend Team', ParentDeptId: 1, ManagerId: null, CreatedOn: now, UpdatedOn: now },
                { Id: 7, Name: 'Frontend Team', ParentDeptId: 1, ManagerId: null, CreatedOn: now, UpdatedOn: now },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert(
            'Designations',
            [
                { Id: 1, Title: 'Software Engineer', Grade: 'L1', DepartmentId: 6, CreatedOn: now, UpdatedOn: now },
                {
                    Id: 2,
                    Title: 'Senior Software Engineer',
                    Grade: 'L2',
                    DepartmentId: 6,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                { Id: 3, Title: 'Engineering Manager', Grade: 'M1', DepartmentId: 1, CreatedOn: now, UpdatedOn: now },
                { Id: 4, Title: 'Frontend Developer', Grade: 'L1', DepartmentId: 7, CreatedOn: now, UpdatedOn: now },
                { Id: 5, Title: 'HR Executive', Grade: 'L1', DepartmentId: 2, CreatedOn: now, UpdatedOn: now },
                { Id: 6, Title: 'HR Manager', Grade: 'M1', DepartmentId: 2, CreatedOn: now, UpdatedOn: now },
                { Id: 7, Title: 'Accountant', Grade: 'L1', DepartmentId: 3, CreatedOn: now, UpdatedOn: now },
                { Id: 8, Title: 'Sales Executive', Grade: 'L1', DepartmentId: 4, CreatedOn: now, UpdatedOn: now },
                { Id: 9, Title: 'Marketing Specialist', Grade: 'L1', DepartmentId: 5, CreatedOn: now, UpdatedOn: now },
            ],
            { transaction },
        );
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('Designations', {}, { transaction });
        await queryInterface.bulkDelete('Departments', {}, { transaction });
    });
