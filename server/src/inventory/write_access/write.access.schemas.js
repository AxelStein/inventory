import Joi from "joi";

export const getWriteAccessListSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
});

export const createWriteAccessSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
});

export const checkWriteAccessParamsSchema = Joi.object({
    id: Joi.number().integer().required(),
})