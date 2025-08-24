import { MulterError } from "multer";
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
    let message = __('general.error.server');
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
                message = __('auth.error.uniqueEmail');
            } else if (err.original.constraint === 'email_verifications_userId_key') {
                message = __('auth.error.verificationCodeSent');
            } else {
                message = __('general.error.uniqueConstraint', fieldName, fieldValue);
            }
        }
    } else if (err instanceof MulterError) {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        switch (err.original.constraint) {
            case 'inventories_categoryId_fkey':
                statusCode = 400;
                message = __('category.error.invalidId');
                break;

            case 'inventory_write_access_userId_fkey':
                statusCode = 404;
                message = __('writeAccess.error.userNotFound');
                break;

            case 'password_resets_userId_key':
                statusCode = 400;
                message = __('auth.error.passwordResetRequested');
                break;

            case 'password_resets_token_key':
                statusCode = 400;
                message = __('auth.error.passwordResetFailed');
                break;

            case 'email_verifications_userId_key':
                statusCode = 400;
                message = __('auth.error.verificationCodeSent');
                break;
        }
    }

    res.status(statusCode).send({ message, details });
}

export default errorHandler;