import Joi from "joi";

export const getInventoryTagsSchema = Joi.object({
    inventoryId: Joi.number().integer().required()
}).required();

export const createTagSchema = (translate) => Joi.object({
    inventoryId: Joi.number().integer().required(),
    name: Joi.string()
        .trim()
        .pattern(/^\S*$/)
        .lowercase()
        .required()
        .messages({
            'string.pattern.base': translate('tag.error.nameTrim'),
            'string.empty': translate('tag.error.nameRequired'),
        }),
}).required();

export const deleteTagSchema = Joi.object({
    id: Joi.number().integer().required(),
    inventoryId: Joi.number().integer().required(),
}).required();