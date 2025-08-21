import Joi from "joi";

export const getPostsSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(10).max(20).default(10),
}).required();

export const createPostSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    title: Joi.string().trim().required(),
    text: Joi.string().trim().required(),
}).required();

export const updatePostSchema = Joi.object({
    title: Joi.string().trim(),
    text: Joi.string().trim(),
}).required();

export const postIdSchema = Joi.object({
    id: Joi.number().integer().required()
}).required();

export const postPusherAuthSchema = Joi.object({
    channel_name: Joi.string().required(),
    socket_id: Joi.string().required(),
    inventoryId: Joi.number().integer(),
}).required();