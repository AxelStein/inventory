import { ValidationError } from "../error/index.js";

const validator = (req, res, next) => {
    if (!req.file) {
        throw new ValidationError(__('image.error.fileRequired'));
    }
    next();
}

export default validator;