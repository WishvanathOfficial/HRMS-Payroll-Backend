import Joi from 'joi';
import { paginationQuery, dateString } from './common.validator';

export const attendanceValidator = {
    listQuery: paginationQuery.keys({
        employeeId: Joi.number().integer().positive().optional(),
        status: Joi.string().valid('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE', 'HOLIDAY').optional(),
        from: dateString.optional(),
        to: dateString.optional(),
    }),
    checkInOut: Joi.object({
        employeeId: Joi.number().integer().positive().required(),
        source: Joi.string().valid('BIOMETRIC', 'WEB', 'MOBILE', 'MANUAL').optional(),
    }),
    summaryQuery: Joi.object({
        year: Joi.number().integer().min(2000).max(3000).optional(),
        month: Joi.number().integer().min(1).max(12).optional(),
    }).unknown(true),
};
