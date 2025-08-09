import Joi from "joi";
import { ValidationError } from "../error/index.js";

/**
 * 
 * @param {Joi.Schema} schema 
 * @param {string} prop
 */
const validateSchema = (schema, prop = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[prop], { abortEarly: false });
    if (error) {
        console.error(error);
        const details = {};
        error.details.forEach((el) => {
            const path = el.path[0];
            const msg = el.message;
            details[path] = msg;
        });
        throw new ValidationError(error.toString(), details);
    }
    if (prop === 'query') {
        req.validatedQuery = value;
    } else {
        req[prop] = value;
    }
    next();
}

export function validateBody(schema) {
    return validateSchema(schema, "body");
}

export function validateQuery(schema) {
    return validateSchema(schema, "query");
}