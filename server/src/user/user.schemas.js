import Joi from "joi";
import UserRole from "./user.role.js";

export const userIdSchema = Joi.object({
    id: Joi.number().integer().required()
}).required();

const idsSchema = Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .required();

const userListBaseSchema = {
    sortBy: Joi.string().valid('lastSeen', 'name', 'email').default('name'),
    sortAsc: Joi.bool().default(true),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(10).max(50).default(10),
}

export const getUserListSchema = Joi.object({
    ...userListBaseSchema,
});

export const blockUsersByIdsSchema = Joi.object({
    ids: idsSchema,
    block: Joi.boolean().required(),
}).required();

export const deleteUsersByIdsSchema = Joi.object({
    ids: idsSchema
}).required();

export const changeUserRoleByIdsSchema = Joi.object({
    ids: idsSchema,
    role: Joi.string().valid(...Object.values(UserRole)).required(),
})

export const searchUsersSchema = Joi.object({
    q: Joi.string().trim().required(),
    ...userListBaseSchema
}).required();