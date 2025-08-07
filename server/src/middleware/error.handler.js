import { ApiError } from "../error/index.js";
import express from 'express';

/**
 * @param {Error} err 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const errorHandler = (err, req, res, _) => {
    console.error(`${err.name}: ${req.method} ${req.originalUrl}`);
    console.error(err);

    let statusCode = 500;
    let message = 'An unexpected error occured. Please try again later';
    let details = undefined;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        if (err.fields && Object.keys(err.fields).length > 0) {
            statusCode = 400;
            const fieldName = Object.keys(err.fields)[0];
            const fieldValue = err.fields[fieldName];
            if (fieldName === "email") {
                message = 'Signup failed. Please try a different email or password.';
            } else {
                message = `The ${fieldName} '${fieldValue}' is already taken.`;
            }
        }
    }

    res.status(statusCode).send({ message, details });
}

export default errorHandler;