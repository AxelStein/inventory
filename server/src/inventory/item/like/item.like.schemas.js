import Joi from "joi";

export const itemLikeSchema = Joi.object({
    id: Joi.number().integer().required(),
});