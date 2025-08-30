import Joi from 'joi';

const createEmailSchema = (translate) => Joi.string()
    .email()
    .required()
    .messages({
        'string.email': translate('auth.error.invalidEmail'),
        'string.empty': translate('auth.error.emailRequired')
    });

const createPasswordSchema = (translate) => Joi.string()
    .regex(/^\S*$/)
    .required()
    .messages({
        'string.pattern.base': translate('auth.error.passwordTrim'),
        'string.empty': translate('auth.error.passwordRequired')
    });

export const signInSchema = (translate) => Joi.object({
    email: createEmailSchema(translate),
    password: createPasswordSchema(translate),
}).required();

export const signInWithGoogleSchema = Joi.object({
    token: Joi.string().required(),
}).required();

export const signUpSchema = (translate) => Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(99)
        .required()
        .messages({
            'string.empty': translate('auth.error.nameRequired')
        }),
    email: createEmailSchema(translate),
    password: createPasswordSchema(translate),
}).required();

export const resetPasswordSchema = (translate) => Joi.object({
    email: createEmailSchema(translate)
}).required();

export const restorePasswordSchema = (translate) => Joi.object({
    token: Joi
        .string()
        .token()
        .required(),
    password: createPasswordSchema(translate)
}).required();

export const verifyEmailSchema = Joi.object({
    code: Joi.string().required(),
    userId: Joi.number().integer().required(),
});