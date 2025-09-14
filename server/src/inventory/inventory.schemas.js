import Joi from 'joi';
import { CustomFieldState, CustomFieldType } from './inventory.custom.field.js';
import InventoryListFilters from './inventory.list.filters.js';
import InventoryListSortBy from "./inventory.list.sort.js";

const customFieldsSchema = Joi.array().items(
    Joi.object({
        name: Joi.string().trim().required(),
        description: Joi.string().trim().allow('').allow(null),
        type: Joi.string().valid(...Object.values(CustomFieldType)).required(),
        state: Joi.string().valid(...Object.values(CustomFieldState)).required(),
    }).required()
);

export const createInventorySchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().allow(''),
    categoryId: Joi.number().integer().required(),
    isPublic: Joi.boolean().required(),
    fields: customFieldsSchema
}).required();

export const updateInventorySchema = Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim().allow(''),
    categoryId: Joi.number().integer(),
    isPublic: Joi.boolean(),
    version: Joi.number().integer().required(),
    fields: customFieldsSchema
}).required();

export const uploadImageSchema = Joi.object({
    version: Joi.number().integer().required()
}).required();

export const createOdooTokenSchema = Joi.object({
    version: Joi.number().integer().required()
}).required();

export const getByOdooTokenSchema = Joi.object({
    token: Joi.string().required()
}).required();

export const deleteImageSchema = Joi.object({
    version: Joi.number().integer().required()
}).required();

const inventoryListBaseSchema = {
    sortBy: Joi.string().valid(...Object.values(InventoryListSortBy)),
    sortAsc: Joi.boolean().default(true),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(50).default(10),
};

export const searchInventorySchema = Joi.object({
    q: Joi.string().trim().required(),
    ...inventoryListBaseSchema,
}).required();

export const getInventoryListSchema = Joi.object({
    filter: Joi.string().valid(...Object.values(InventoryListFilters)),
    tagId: Joi.number().integer(),
    userId: Joi.number().integer(),
    ...inventoryListBaseSchema,
}).required();

export const checkInventoryParamsSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
}).required();