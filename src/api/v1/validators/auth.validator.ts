import Joi from 'joi';

const ROLES = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] as const;

export const authValidator = {
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required(),
    }),
    refresh: Joi.object({
        refreshToken: Joi.string().required(),
    }),
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        employeeId: Joi.number().integer().positive().allow(null).optional(),
        roles: Joi.array()
            .items(Joi.string().valid(...ROLES))
            .optional(),
    }),
    changePassword: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required(),
    }),
};
