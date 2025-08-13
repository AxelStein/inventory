import Joi from 'joi';
import { customFields } from './inventory.custom.field.js';
import InventoryListFilters from './inventory.list.filters.js';

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

export const uploadImageSchema = Joi.object({
    version: Joi.number().integer().required()
});

export const getInventoryListSchema = Joi.object({
    filter: Joi.string().valid(...Object.values(InventoryListFilters)),
    sortBy: Joi.string().valid('title', 'createdAt', 'updatedAt'),
    sortAsc: Joi.boolean().default(false),
});