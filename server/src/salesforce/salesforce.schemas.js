import Joi from 'joi';
import JoiPhoneNumber from 'joi-phone-number';

export const createContactSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.extend(JoiPhoneNumber)
        .string()
        .phoneNumber()
        .allow('')
        .allow(null)
});

export const createAccountSchema = Joi.object({
    userId: Joi.number().required(),
    name: Joi.string().trim().required(),
    industry: Joi.string().trim().required(),
    phone: Joi.string().trim().allow('').allow(null),
    website: Joi.string().uri().allow('').allow(null),
    contacts: Joi.array().items(createContactSchema)
}).required();