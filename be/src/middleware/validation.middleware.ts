import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { AppError } from '../utils/errors';

export const validate = (schema: yup.ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors = error.inner.map(err => ({
                    path: err.path,
                    message: err.message
                }));
                throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
            }
            next(error);
        }
    };
};
