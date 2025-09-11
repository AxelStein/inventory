import Joi from 'joi';
import JoiPhoneNumber from 'joi-phone-number';

export const createContactSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.extend(JoiPhoneNumber).string().phoneNumber()
});

export const createAccountSchema = Joi.object({
    name: Joi.string().trim().required(),
    industry: Joi.string().trim().required(),
    phone: Joi.string().trim(),
    website: Joi.string().uri(),
    contacts: Joi.array().items(createContactSchema)
}).required();