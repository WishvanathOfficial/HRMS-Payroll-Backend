import Joi from 'joi';
import { paginationQuery } from './common.validator';

export const payrollRunValidator = {
    listQuery: paginationQuery.keys({
        year: Joi.number().integer().min(2000).max(3000).optional(),
        month: Joi.number().integer().min(1).max(12).optional(),
        status: Joi.string().valid('DRAFT', 'PROCESSING', 'COMPLETED', 'FAILED', 'LOCKED').optional(),
    }),
    create: Joi.object({
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(2000).max(3000).required(),
        status: Joi.string().valid('DRAFT', 'PROCESSING', 'COMPLETED', 'FAILED', 'LOCKED').optional(),
    }),
    process: Joi.object({
        processedBy: Joi.number().integer().positive().required(),
    }),
};

export const payslipValidator = {
    listQuery: paginationQuery.keys({
        payrollRunId: Joi.number().integer().positive().optional(),
        employeeId: Joi.number().integer().positive().optional(),
        status: Joi.string().valid('DRAFT', 'GENERATED', 'PAID', 'CANCELLED').optional(),
    }),
};
