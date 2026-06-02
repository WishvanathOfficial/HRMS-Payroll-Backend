import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';
import { Messages } from '../constants';

export type ValidatableSource = 'body' | 'query' | 'params';

export interface ValidationSchema {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
}

/**
 * Joi-based request validator.
 *
 * Validates any combination of body / query / params against a schema and
 * forwards a 422 ApiError with field-level error details if validation fails.
 */
export const validate = (schema: ValidationSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const errors: Record<string, string[]> = {};
    const sources: ValidatableSource[] = ['body', 'query', 'params'];

    for (const source of sources) {
        const sub = schema[source];
        if (!sub) continue;
        const { value, error } = sub.validate(req[source], {
            abortEarly: false,
            stripUnknown: true,
            convert: true,
        });
        if (error) {
            errors[source] = error.details.map((d) => d.message);
        } else {
            // Mutate the request payload with the coerced/cleaned value.
            (req as unknown as Record<string, unknown>)[source] = value;
        }
    }

    if (Object.keys(errors).length) {
        return next(ApiError.unprocessable(Messages.Common.ValidationFailed, errors));
    }
    return next();
};

/** Shorthand: validate that `:id` (or any numeric URL param) is a positive integer. */
export const numericParam = (name = 'id') =>
    validate({
        params: Joi.object({ [name]: Joi.number().integer().positive().required() }).unknown(true),
    });

export default validate;
