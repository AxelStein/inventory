import { ValidationError } from "../error/index.js";

const validator = (req, res, next) => {
    if (!req.file) {
        throw new ValidationError('File is required');
    }
    next();
}

export default validator;