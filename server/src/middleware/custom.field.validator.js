import { ValidationError } from "../error/index.js";
import { CustomFieldState, MAX_FIELDS_PER_TYPE } from "../inventory/inventory.custom.field.js";
import { snakeToCamel } from "../util/string.util.js";

const validator = (req, res, next) => {
    const fields = req.body?.customFields;
    if (!fields) {
        return next();
    }

    const types = {};

    fields.forEach(field => {
        let fieldCount = types[field.type] || 0;
        if (fieldCount === MAX_FIELDS_PER_TYPE) {
            throw new ValidationError(`There are more than ${MAX_FIELDS_PER_TYPE} fields of type "${field.type}"`);
        }
        fieldCount++;
        types[field.type] = fieldCount;

        // const data = {};
        const prefix = `custom_${field.type}_${fieldCount}`;
        req.body[snakeToCamel(`${prefix}_name`)] = field.title;
        req.body[snakeToCamel(`${prefix}_description`)] = field.description;
        req.body[snakeToCamel(`${prefix}_state`)] = field.isVisible ? CustomFieldState.VISIBLE : CustomFieldState.HIDDEN;
    });

    delete req.body.customFields;

    next();
};

export default validator;