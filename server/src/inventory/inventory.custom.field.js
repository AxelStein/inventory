import { DataTypes } from "sequelize";
import { snakeToCamel } from "../util/string.util.js";

export const MAX_FIELDS_PER_TYPE = 3;

export const CustomFieldType = Object.freeze({
    STRING: 'string',
    TEXT: 'text',
    INT: 'int',
    LINK: 'link',
    BOOLEAN: 'boolean',
});

export const customFields = [
    { type: CustomFieldType.STRING, dbType: DataTypes.STRING },
    { type: CustomFieldType.TEXT, dbType: DataTypes.TEXT },
    { type: CustomFieldType.INT, dbType: DataTypes.INTEGER },
    { type: CustomFieldType.LINK, dbType: DataTypes.TEXT },
    { type: CustomFieldType.BOOLEAN, dbType: DataTypes.BOOLEAN },
]

export const CustomFieldState = Object.freeze({
    VISIBLE: 'visible',
    HIDDEN: 'hidden',
    values: function() {
        return [this.VISIBLE, this.HIDDEN];
    }
});

export const inflateInventoryCustomFields = (inflate) => {
    customFields.forEach(field => {
        for (let i = 1; i <= MAX_FIELDS_PER_TYPE; i++) {
            const prefix = snakeToCamel(`custom_${field.type}_${i}`);
            inflate(prefix, field);
        }
    });
}