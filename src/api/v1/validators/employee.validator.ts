import Joi from 'joi';
import { paginationQuery, dateString } from './common.validator';

const STATUS = ['ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE'] as const;
const GENDER = ['MALE', 'FEMALE', 'OTHER'] as const;

export const employeeValidator = {
    listQuery: paginationQuery.keys({
        q: Joi.string().max(120).optional(),
        departmentId: Joi.number().integer().positive().optional(),
        designationId: Joi.number().integer().positive().optional(),
        status: Joi.string()
            .valid(...STATUS)
            .optional(),
    }),
    create: Joi.object({
        empCode: Joi.string().max(30).required(),
        firstName: Joi.string().max(80).required(),
        lastName: Joi.string().max(80).required(),
        email: Joi.string().email().max(160).required(),
        phone: Joi.string().max(30).optional().allow(null, ''),
        dob: dateString.optional().allow(null),
        gender: Joi.string()
            .valid(...GENDER)
            .optional()
            .allow(null),
        joinDate: dateString.required(),
        departmentId: Joi.number().integer().positive().optional().allow(null),
        designationId: Joi.number().integer().positive().optional().allow(null),
        reportingTo: Joi.number().integer().positive().optional().allow(null),
        status: Joi.string()
            .valid(...STATUS)
            .optional(),
    }),
    update: Joi.object({
        firstName: Joi.string().max(80).optional(),
        lastName: Joi.string().max(80).optional(),
        email: Joi.string().email().max(160).optional(),
        phone: Joi.string().max(30).optional().allow(null, ''),
        dob: dateString.optional().allow(null),
        gender: Joi.string()
            .valid(...GENDER)
            .optional()
            .allow(null),
        departmentId: Joi.number().integer().positive().optional().allow(null),
        designationId: Joi.number().integer().positive().optional().allow(null),
        reportingTo: Joi.number().integer().positive().optional().allow(null),
        status: Joi.string()
            .valid(...STATUS)
            .optional(),
    }).min(1),
    setStatus: Joi.object({
        status: Joi.string()
            .valid(...STATUS)
            .required(),
    }),
};
