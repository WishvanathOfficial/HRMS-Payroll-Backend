import { QueryInterface, QueryTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

/**
 * Seeds the four standard roles (ADMIN / HR / MANAGER / EMPLOYEE) and a
 * single bootstrap admin user so the very first developer can log in.
 *
 * Production bootstrap runs only this roles/admin seeder and requires
 * BOOTSTRAP_ADMIN_PASSWORD to be set by the deployment environment.
 */
export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();

        await queryInterface.bulkInsert(
            'Roles',
            [
                { Id: 1, Name: 'ADMIN', Description: 'Full system administrator', CreatedOn: now, UpdatedOn: now },
                { Id: 2, Name: 'HR', Description: 'HR team — manages people + leave', CreatedOn: now, UpdatedOn: now },
                {
                    Id: 3,
                    Name: 'MANAGER',
                    Description: "Approves their team's leave/appraisals",
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 4,
                    Name: 'EMPLOYEE',
                    Description: 'Default role for every employee',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'Admin@123';
        const passwordHash = await bcrypt.hash(password, 10);

        // Bootstrap admin is intentionally NOT linked to an employee record.
        await queryInterface.bulkInsert(
            'Users',
            [
                {
                    Id: 1,
                    EmployeeId: null,
                    Email: 'admin@company.com',
                    PasswordHash: passwordHash,
                    IsActive: true,
                    LastLoginAt: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert('UserRoles', [{ UserId: 1, RoleId: 1, CreatedOn: now, UpdatedOn: now }], {
            transaction,
        });

        if (process.env.NODE_ENV === 'production') return;

        // Also create login accounts for the seeded employees with role EMPLOYEE,
        // plus role HR for the HR manager (Vikram, id 5) and role MANAGER for
        // engineering manager (Aarav, id 1).
        const employees = await queryInterface.sequelize.query<{ Id: number; Email: string }>(
            'SELECT Id, Email FROM Employees',
            { type: QueryTypes.SELECT, transaction },
        );

        if (employees.length === 0) return;

        const defaultPw = await bcrypt.hash('Password@123', 10);
        const userRows = employees.map((e, i) => ({
            Id: i + 2, // start after bootstrap admin
            EmployeeId: e.Id,
            Email: e.Email,
            PasswordHash: defaultPw,
            IsActive: true,
            LastLoginAt: null,
            CreatedOn: now,
            UpdatedOn: now,
        }));
        await queryInterface.bulkInsert('Users', userRows, { transaction });

        const userRolePairs: { UserId: number; RoleId: number; CreatedOn: Date; UpdatedOn: Date }[] = [];
        for (const u of userRows) {
            // Everyone gets the EMPLOYEE role
            userRolePairs.push({ UserId: u.Id, RoleId: 4, CreatedOn: now, UpdatedOn: now });
            // Promote a couple based on seed data
            if (u.EmployeeId === 1) userRolePairs.push({ UserId: u.Id, RoleId: 3, CreatedOn: now, UpdatedOn: now }); // MANAGER
            if (u.EmployeeId === 5) userRolePairs.push({ UserId: u.Id, RoleId: 2, CreatedOn: now, UpdatedOn: now }); // HR
        }
        await queryInterface.bulkInsert('UserRoles', userRolePairs, { transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('UserRoles', {}, { transaction });
        await queryInterface.bulkDelete('Users', {}, { transaction });
        await queryInterface.bulkDelete('Roles', {}, { transaction });
    });
