import { ValidationError } from "../error/index.js";
import Joi from "joi";

/**
 * @param {Joi.Schema} schema 
 * @param {string} prop
 */
const validateSchemaFromRequest = (schema, prop) => (req, res, next) => {
    const value = validateSchema(schema, req[prop]);
    if (prop === 'query') {
        req.validatedQuery = value;
    } else {
        req[prop] = value;
    }
    next();
}

/**
 * @param {Joi.Schema} schema 
 * @param {any} data
 */
export const validateSchema = (schema, data) => {
    if (typeof schema === 'function') {
        schema = schema(__);
    }
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        console.error(error);
        const details = {};
        error.details.forEach((el) => {
            const path = el.path[0];
            if (el.path.length === 3) {
                const index = el.path[1];
                const name = el.path[2];
                if (!details[path]) {
                    details[path] = {};
                }
                if (!details[path][index]) {
                    details[path][index] = {};
                }
                details[path][index][name] = el.message;
            } else {
                details[path] = el.message;
            }
        });
        throw new ValidationError(error.toString(), details);
    }
    return value;
}

export const validateBody = (schema) => validateSchemaFromRequest(schema, "body")

export const validateQuery = (schema) => validateSchemaFromRequest(schema, "query")

export const validateParams = (schema) => validateSchemaFromRequest(schema, "params")