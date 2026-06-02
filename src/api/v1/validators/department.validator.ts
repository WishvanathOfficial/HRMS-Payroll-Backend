import Joi from 'joi';
import { paginationQuery } from './common.validator';

export const departmentValidator = {
    listQuery: paginationQuery.keys({
        q: Joi.string().max(120).optional(),
        parentDeptId: Joi.number().integer().positive().optional(),
    }),
    create: Joi.object({
        name: Joi.string().max(120).required(),
        parentDeptId: Joi.number().integer().positive().allow(null).optional(),
        managerId: Joi.number().integer().positive().allow(null).optional(),
    }),
    update: Joi.object({
        name: Joi.string().max(120).optional(),
        parentDeptId: Joi.number().integer().positive().allow(null).optional(),
        managerId: Joi.number().integer().positive().allow(null).optional(),
    }).min(1),
};
