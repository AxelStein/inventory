import Joi from "joi";

export const createCommentSchema = Joi.object({
    postId: Joi.number().integer().required(),
    text: Joi.string().trim().required(),
}).required();

export const updateCommentSchema = Joi.object({
    text: Joi.string().trim(),
}).required();

export const commentIdSchema = Joi.object({
    id: Joi.number().integer().required()
}).required();

export const getCommentsSchema = Joi.object({
    postId: Joi.number().integer().required(),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(10).max(20).default(10),
}).required();