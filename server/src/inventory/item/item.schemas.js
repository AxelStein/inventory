import Joi from 'joi';

export const getItemListSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    sortBy: Joi.string(),
    sortAsc: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(50).default(10),
});