import Joi from 'joi';

/** Shared Joi fragments reused across many validators. */

export const idParam = Joi.object({
    id: Joi.number().integer().positive().required(),
}).unknown(true);

export const employeeIdParam = Joi.object({
    employeeId: Joi.number().integer().positive().required(),
}).unknown(true);

export const paginationQuery = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
}).unknown(true);

export const dateString = Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .message('Date must be YYYY-MM-DD');
