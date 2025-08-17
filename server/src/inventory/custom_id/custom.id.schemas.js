import Joi from "joi";
import CustomIdType from "./custom.id.type.js";

export const getCustomIdsSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
});

export  const createCustomIdSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    type: Joi.string().valid(...Object.values(CustomIdType)).required(),
    rule: Joi.string().trim().allow(''),
});