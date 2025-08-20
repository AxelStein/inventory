import Joi from "joi";

export const getInventoryTagsSchema = Joi.object({
    inventoryId: Joi.number().integer().required()
});

export const createTagSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    name: Joi.string()
        .trim()
        .pattern(/^\S*$/)
        .lowercase()
        .required()
        .messages({
            'string.pattern.base': 'No whitespaces allowed in tag name',
            'string.empty': 'Tag name is required',
        }),
});

export const deleteTagSchema = Joi.object({
    id: Joi.number().integer().required(),
    inventoryId: Joi.number().integer().required(),
});