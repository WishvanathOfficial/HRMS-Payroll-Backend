import Joi from 'joi';
import { paginationQuery } from './common.validator';

export const designationValidator = {
    listQuery: paginationQuery.keys({
        q: Joi.string().max(120).optional(),
        departmentId: Joi.number().integer().positive().optional(),
    }),
    create: Joi.object({
        title: Joi.string().max(120).required(),
        grade: Joi.string().max(30).optional().allow(null, ''),
        departmentId: Joi.number().integer().positive().required(),
    }),
    update: Joi.object({
        title: Joi.string().max(120).optional(),
        grade: Joi.string().max(30).optional().allow(null, ''),
        departmentId: Joi.number().integer().positive().optional(),
    }).min(1),
};
