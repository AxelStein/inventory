import { DataTypes } from "sequelize";
import { snakeToCamel } from "../util/string.util.js";

export const MAX_FIELDS_PER_TYPE = 3;

export const customFields = [
    { type: 'string', dbType: DataTypes.STRING },
    { type: 'text', dbType: DataTypes.TEXT },
    { type: 'int', dbType: DataTypes.INTEGER },
    { type: 'link', dbType: DataTypes.TEXT },
    { type: 'boolean', dbType: DataTypes.BOOLEAN },
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