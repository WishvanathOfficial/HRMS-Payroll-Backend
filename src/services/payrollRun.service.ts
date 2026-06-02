import { Op } from 'sequelize';
import {
    sequelize,
    PayrollRun,
    Payslip,
    PayslipDetail,
    StatutoryDeduction,
    EmployeeSalary,
    SalaryStructureComponent,
    SalaryComponent,
} from '../models';
import { PayrollRunAttributes, PayrollRunStatus } from '../models/payroll-run';
import { ApiError } from '../utils/ApiError';
import { Messages } from '../constants';

export const payrollRunService = {
    async list(filters: { year?: number; month?: number; status?: PayrollRunStatus; limit: number; offset: number }) {
        const where: Record<string, unknown> = {};
        if (filters.year) where.year = filters.year;
        if (filters.month) where.month = filters.month;
        if (filters.status) where.status = filters.status;
        const { rows, count } = await PayrollRun.findAndCountAll({
            where,
            order: [
                ['year', 'DESC'],
                ['month', 'DESC'],
            ],
            limit: filters.limit,
            offset: filters.offset,
        });
        return { rows, total: count };
    },

    async getById(id: number) {
        const row = await PayrollRun.findByPk(id);
        if (!row) throw ApiError.notFound('Payroll run not found');
        return row;
    },

    async create(payload: Partial<PayrollRunAttributes>) {
        if (!payload.month || !payload.year) throw ApiError.badRequest('month and year are required');
        if (await PayrollRun.findOne({ where: { month: payload.month, year: payload.year } })) {
            throw ApiError.conflict(Messages.Payroll.DuplicateRun);
        }
        return PayrollRun.create({ ...payload, status: payload.status ?? 'DRAFT' } as never);
    },

    async update(id: number, payload: Partial<PayrollRunAttributes>) {
        const row = await this.getById(id);
        await row.update(payload as never);
        return row;
    },

    async remove(id: number) {
        const run = await this.getById(id);
        const status = run.get('status') as PayrollRunStatus;
        if (status === 'COMPLETED' || status === 'LOCKED') {
            throw ApiError.badRequest('Cannot delete a completed/locked payroll run');
        }
        await run.destroy();
    },

    /**
     * Build payslips for every employee with an active salary using the
     * component breakdown of their assigned salary structure. Runs in a single
     * transaction; existing payslips for the run are wiped first so the
     * operation is idempotent.
     */
    async process(id: number, processedBy: number) {
        const run = await this.getById(id);
        const status = run.get('status') as PayrollRunStatus;
        if (status === 'COMPLETED' || status === 'LOCKED') {
            throw ApiError.badRequest(Messages.Payroll.AlreadyProcessed);
        }

        await sequelize.transaction(async (trx) => {
            await run.update({ status: 'PROCESSING' } as never, { transaction: trx });

            const existing = await Payslip.findAll({ where: { payrollRunId: id }, transaction: trx });
            const existingIds = existing.map((p) => p.get('id') as number);
            if (existingIds.length) {
                await StatutoryDeduction.destroy({ where: { payslipId: { [Op.in]: existingIds } }, transaction: trx });
                await PayslipDetail.destroy({ where: { payslipId: { [Op.in]: existingIds } }, transaction: trx });
                await Payslip.destroy({ where: { payrollRunId: id }, transaction: trx });
            }

            const today = new Date().toISOString().slice(0, 10);
            const salaries = await EmployeeSalary.findAll({
                where: {
                    effectiveFrom: { [Op.lte]: today },
                    [Op.or]: [{ effectiveTo: null }, { effectiveTo: { [Op.gte]: today } }],
                },
                transaction: trx,
            });

            const componentCache = new Map<number, unknown>();
            const getComp = async (cid: number) => {
                if (componentCache.has(cid)) return componentCache.get(cid)!;
                const c = await SalaryComponent.findByPk(cid, { transaction: trx });
                if (c) componentCache.set(cid, c);
                return c;
            };

            for (const sal of salaries) {
                const structureId = sal.get('structureId') as number;
                const ctc = Number(sal.get('ctc'));
                const employeeId = sal.get('employeeId') as number;

                const mappings = await SalaryStructureComponent.findAll({ where: { structureId }, transaction: trx });
                const monthlyBase = ctc / 12;
                let gross = 0;
                let deductions = 0;
                const details: Record<string, unknown>[] = [];

                for (const m of mappings) {
                    const componentId = m.get('componentId') as number;
                    const comp = (await getComp(componentId)) as { get(key: string): unknown } | undefined;
                    if (!comp) continue;
                    const calcType = comp.get('calcType') as string;
                    const compType = comp.get('type') as 'EARNING' | 'DEDUCTION';
                    const compId = comp.get('id') as number;
                    const amount =
                        calcType === 'PERCENTAGE'
                            ? Math.round(monthlyBase * (Number(m.get('percentage')) / 100))
                            : Math.round(Number(m.get('amount')));

                    details.push({ componentId: compId, amount, componentType: compType });
                    if (compType === 'EARNING') gross += amount;
                    else deductions += amount;
                }

                const payslip = await Payslip.create(
                    {
                        payrollRunId: id,
                        employeeId,
                        grossSalary: gross,
                        totalDeductions: deductions,
                        netSalary: gross - deductions,
                        paidDays: 30,
                        lopDays: 0,
                        status: 'GENERATED',
                    } as never,
                    { transaction: trx },
                );

                if (details.length) {
                    const payslipId = payslip.get('id') as number;
                    await PayslipDetail.bulkCreate(
                        details.map((d) => ({ ...d, payslipId }) as never),
                        { transaction: trx },
                    );
                }
            }

            await run.update({ status: 'COMPLETED', processedAt: new Date(), processedBy } as never, {
                transaction: trx,
            });
        });

        return run.reload();
    },

    async lock(id: number) {
        const run = await this.getById(id);
        if (run.get('status') !== 'COMPLETED') throw ApiError.badRequest(Messages.Payroll.NotCompleted);
        await run.update({ status: 'LOCKED' } as never);
        return run;
    },
};
