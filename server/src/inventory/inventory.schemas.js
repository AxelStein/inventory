import Joi from 'joi';
import { CustomFieldType } from './inventory.custom.field.js';
import InventoryListFilters from './inventory.list.filters.js';

const customFieldsSchema = Joi.array().items(
    Joi.object({
        title: Joi.string().trim().required(),
        description: Joi.string().trim().allow(''),
        type: Joi.string().valid(...Object.values(CustomFieldType)).required(),
        isVisible: Joi.boolean().required(),
    }).required()
);

export const createInventorySchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().allow(''),
    categoryId: Joi.number().integer().required(),
    isPublic: Joi.boolean().required(),
    customFields: customFieldsSchema.required()
}).required();

export const updateInventorySchema = Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim().allow(''),
    categoryId: Joi.number().integer(),
    isPublic: Joi.boolean(),
    version: Joi.number().integer().required(),
    customFields: customFieldsSchema
}).required();

export const uploadImageSchema = Joi.object({
    version: Joi.number().integer().required()
}).required();

export const getInventoryListSchema = Joi.object({
    filter: Joi.string().valid(...Object.values(InventoryListFilters)),
    sortBy: Joi.string().valid('title', 'createdAt', 'updatedAt'),
    sortAsc: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(10).max(50).default(10),
}).required();

export const checkInventoryParamsSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
}).required();