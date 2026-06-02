import { QueryInterface } from 'sequelize';

export const up = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        const now = new Date();

        await queryInterface.bulkInsert(
            'SalaryStructures',
            [
                {
                    Id: 1,
                    Name: 'Standard Structure',
                    Description: 'Default salary structure for all employees',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    Name: 'Manager Structure',
                    Description: 'Salary structure for managers',
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert(
            'SalaryComponents',
            [
                {
                    Id: 1,
                    Name: 'Basic',
                    Type: 'EARNING',
                    CalcType: 'PERCENTAGE',
                    Value: 40,
                    Taxable: true,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 2,
                    Name: 'HRA',
                    Type: 'EARNING',
                    CalcType: 'PERCENTAGE',
                    Value: 20,
                    Taxable: true,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 3,
                    Name: 'Special Allowance',
                    Type: 'EARNING',
                    CalcType: 'PERCENTAGE',
                    Value: 30,
                    Taxable: true,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 4,
                    Name: 'Conveyance',
                    Type: 'EARNING',
                    CalcType: 'FIXED',
                    Value: 1600,
                    Taxable: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 5,
                    Name: 'Medical',
                    Type: 'EARNING',
                    CalcType: 'FIXED',
                    Value: 1250,
                    Taxable: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 6,
                    Name: 'Provident Fund',
                    Type: 'DEDUCTION',
                    CalcType: 'PERCENTAGE',
                    Value: 12,
                    Taxable: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 7,
                    Name: 'Professional Tax',
                    Type: 'DEDUCTION',
                    CalcType: 'FIXED',
                    Value: 200,
                    Taxable: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    Id: 8,
                    Name: 'Income Tax (TDS)',
                    Type: 'DEDUCTION',
                    CalcType: 'PERCENTAGE',
                    Value: 10,
                    Taxable: false,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert(
            'SalaryStructureComponents',
            [
                { StructureId: 1, ComponentId: 1, Amount: 0, Percentage: 40, CreatedOn: now, UpdatedOn: now },
                { StructureId: 1, ComponentId: 2, Amount: 0, Percentage: 20, CreatedOn: now, UpdatedOn: now },
                { StructureId: 1, ComponentId: 3, Amount: 0, Percentage: 30, CreatedOn: now, UpdatedOn: now },
                { StructureId: 1, ComponentId: 4, Amount: 1600, Percentage: 0, CreatedOn: now, UpdatedOn: now },
                { StructureId: 1, ComponentId: 5, Amount: 1250, Percentage: 0, CreatedOn: now, UpdatedOn: now },
                { StructureId: 1, ComponentId: 6, Amount: 0, Percentage: 12, CreatedOn: now, UpdatedOn: now },
                { StructureId: 1, ComponentId: 7, Amount: 200, Percentage: 0, CreatedOn: now, UpdatedOn: now },
                { StructureId: 1, ComponentId: 8, Amount: 0, Percentage: 10, CreatedOn: now, UpdatedOn: now },
                { StructureId: 2, ComponentId: 1, Amount: 0, Percentage: 45, CreatedOn: now, UpdatedOn: now },
                { StructureId: 2, ComponentId: 2, Amount: 0, Percentage: 25, CreatedOn: now, UpdatedOn: now },
                { StructureId: 2, ComponentId: 3, Amount: 0, Percentage: 20, CreatedOn: now, UpdatedOn: now },
                { StructureId: 2, ComponentId: 6, Amount: 0, Percentage: 12, CreatedOn: now, UpdatedOn: now },
                { StructureId: 2, ComponentId: 7, Amount: 200, Percentage: 0, CreatedOn: now, UpdatedOn: now },
            ],
            { transaction },
        );

        await queryInterface.bulkInsert(
            'EmployeeSalaries',
            [
                {
                    EmployeeId: 1,
                    StructureId: 2,
                    Ctc: 2400000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 2,
                    StructureId: 1,
                    Ctc: 1500000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 3,
                    StructureId: 1,
                    Ctc: 900000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 4,
                    StructureId: 1,
                    Ctc: 1100000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 5,
                    StructureId: 2,
                    Ctc: 2200000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 6,
                    StructureId: 1,
                    Ctc: 800000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 7,
                    StructureId: 1,
                    Ctc: 1300000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 8,
                    StructureId: 1,
                    Ctc: 750000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 9,
                    StructureId: 1,
                    Ctc: 850000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
                {
                    EmployeeId: 10,
                    StructureId: 1,
                    Ctc: 720000,
                    EffectiveFrom: '2024-01-01',
                    EffectiveTo: null,
                    CreatedOn: now,
                    UpdatedOn: now,
                },
            ],
            { transaction },
        );
    });

export const down = (queryInterface: QueryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.bulkDelete('EmployeeSalaries', {}, { transaction });
        await queryInterface.bulkDelete('SalaryStructureComponents', {}, { transaction });
        await queryInterface.bulkDelete('SalaryComponents', {}, { transaction });
        await queryInterface.bulkDelete('SalaryStructures', {}, { transaction });
    });
