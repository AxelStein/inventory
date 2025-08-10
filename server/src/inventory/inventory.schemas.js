import Joi from 'joi';
import { customFields } from './inventory.custom.field.js';

const customFieldsSchema = Joi.array().items(
    Joi.object({
        title: Joi.string().trim().required(),
        description: Joi.string().trim().allow(''),
        type: Joi.string().valid(...customFields.map(e => e.type)).required(),
        isVisible: Joi.boolean().required(),
    }).required()
);

export const createInventorySchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim(),
    categoryId: Joi.number().integer().required(),
    isPublic: Joi.boolean().required(),
    customFields: customFieldsSchema.required()
});

export const updateInventorySchema = Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    categoryId: Joi.number().integer(),
    isPublic: Joi.boolean(),
    version: Joi.number().integer().required(),
    customFields: customFieldsSchema
});