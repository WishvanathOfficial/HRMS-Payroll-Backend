import { QueryInterface, QueryTypes } from 'sequelize';

export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();

        await queryInterface.bulkInsert(
            'PayrollRuns',
            [
                {
                    Id: 1,
                    Month: 3,
                    Year: 2026,
                    Status: 'COMPLETED',
                    ProcessedAt: new Date('2026-04-01T10:00:00Z'),
                    ProcessedBy: 5,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    Month: 4,
                    Year: 2026,
                    Status: 'COMPLETED',
                    ProcessedAt: new Date('2026-05-01T10:00:00Z'),
                    ProcessedBy: 5,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        const ctcMap: Record<number, number> = {
            1: 2400000,
            2: 1500000,
            3: 900000,
            4: 1100000,
            5: 2200000,
            6: 800000,
            7: 1300000,
            8: 750000,
            9: 850000,
            10: 720000,
        };
        const payslips: Record<string, unknown>[] = [];
        for (const runId of [1, 2]) {
            for (const empId of Object.keys(ctcMap)) {
                const ctc = ctcMap[Number(empId)];
                const gross = Math.round(ctc / 12);
                const deductions = Math.round(gross * 0.22);
                const net = gross - deductions;
                payslips.push({
                    PayrollRunId: runId,
                    EmployeeId: Number(empId),
                    GrossSalary: gross,
                    TotalDeductions: deductions,
                    NetSalary: net,
                    PaidDays: 30,
                    LopDays: 0,
                    Status: 'PAID',
                    CreatedOn: now,
                    UpdatedOn: now,
                });
            }
        }
        await queryInterface.bulkInsert('Payslips', payslips, { transaction });

        const firstRunSlips = await queryInterface.sequelize.query<{ Id: number; GrossSalary: number }>(
            'SELECT Id, GrossSalary FROM Payslips WHERE PayrollRunId = 1',
            { type: QueryTypes.SELECT, transaction },
        );

        const details: Record<string, unknown>[] = [];
        const statutory: Record<string, unknown>[] = [];
        for (const slip of firstRunSlips) {
            const gross = Number(slip.GrossSalary);
            const basic = Math.round(gross * 0.4);
            const hra = Math.round(gross * 0.2);
            const special = Math.round(gross * 0.3);
            const pf = Math.round(basic * 0.12);
            const pt = 200;
            const tds = Math.round(gross * 0.1);

            details.push({
                PayslipId: slip.Id,
                ComponentId: 1,
                Amount: basic,
                ComponentType: 'EARNING',
                CreatedOn: now,
                UpdatedOn: now,
            });
            details.push({
                PayslipId: slip.Id,
                ComponentId: 2,
                Amount: hra,
                ComponentType: 'EARNING',
                CreatedOn: now,
                UpdatedOn: now,
            });
            details.push({
                PayslipId: slip.Id,
                ComponentId: 3,
                Amount: special,
                ComponentType: 'EARNING',
                CreatedOn: now,
                UpdatedOn: now,
            });
            details.push({
                PayslipId: slip.Id,
                ComponentId: 6,
                Amount: pf,
                ComponentType: 'DEDUCTION',
                CreatedOn: now,
                UpdatedOn: now,
            });
            details.push({
                PayslipId: slip.Id,
                ComponentId: 7,
                Amount: pt,
                ComponentType: 'DEDUCTION',
                CreatedOn: now,
                UpdatedOn: now,
            });
            details.push({
                PayslipId: slip.Id,
                ComponentId: 8,
                Amount: tds,
                ComponentType: 'DEDUCTION',
                CreatedOn: now,
                UpdatedOn: now,
            });

            statutory.push({
                PayslipId: slip.Id,
                Type: 'PF',
                EmployeeShare: pf,
                EmployerShare: pf,
                TaxableIncome: gross,
                TdsAmount: 0,
                CreatedOn: now,
                UpdatedOn: now,
            });
            statutory.push({
                PayslipId: slip.Id,
                Type: 'TDS',
                EmployeeShare: tds,
                EmployerShare: 0,
                TaxableIncome: gross,
                TdsAmount: tds,
                CreatedOn: now,
                UpdatedOn: now,
            });
            statutory.push({
                PayslipId: slip.Id,
                Type: 'PT',
                EmployeeShare: pt,
                EmployerShare: 0,
                TaxableIncome: 0,
                TdsAmount: 0,
                CreatedOn: now,
                UpdatedOn: now,
            });
        }
        await queryInterface.bulkInsert('PayslipDetails', details, { transaction });
        await queryInterface.bulkInsert('StatutoryDeductions', statutory, { transaction });
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('StatutoryDeductions', {}, { transaction });
        await queryInterface.bulkDelete('PayslipDetails', {}, { transaction });
        await queryInterface.bulkDelete('Payslips', {}, { transaction });
        await queryInterface.bulkDelete('PayrollRuns', {}, { transaction });
    });
