import Joi from 'joi';
import { paginationQuery, dateString } from './common.validator';

export const leaveRequestValidator = {
    listQuery: paginationQuery.keys({
        employeeId: Joi.number().integer().positive().optional(),
        status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED').optional(),
    }),
    create: Joi.object({
        employeeId: Joi.number().integer().positive().required(),
        leaveTypeId: Joi.number().integer().positive().required(),
        fromDate: dateString.required(),
        toDate: dateString.required(),
        days: Joi.number().positive().optional(),
        reason: Joi.string().max(500).optional().allow(null, ''),
    }),
    approve: Joi.object({
        approvedBy: Joi.number().integer().positive().required(),
    }),
    reject: Joi.object({
        approvedBy: Joi.number().integer().positive().required(),
    }),
};

export const leaveTypeValidator = {
    create: Joi.object({
        name: Joi.string().max(80).required(),
        daysAllowed: Joi.number().integer().min(0).optional(),
        isPaid: Joi.boolean().optional(),
        carryForward: Joi.boolean().optional(),
    }),
    update: Joi.object({
        name: Joi.string().max(80).optional(),
        daysAllowed: Joi.number().integer().min(0).optional(),
        isPaid: Joi.boolean().optional(),
        carryForward: Joi.boolean().optional(),
    }).min(1),
};
