import Joi from 'joi';
import { CustomFieldType, inflateInventoryCustomFields } from '../inventory.custom.field.js';

const createItemSchemaData = {};
inflateInventoryCustomFields((prefix, field) => {
    switch (field.type) {
        case CustomFieldType.STRING:
        case CustomFieldType.TEXT:
            createItemSchemaData[prefix] = Joi.string().trim().allow('');
            break;

        case CustomFieldType.INT:
            createItemSchemaData[prefix] = Joi.number().integer();
            break;

        case CustomFieldType.LINK:
            createItemSchemaData[prefix] = Joi.string().uri({
                scheme: ['http', 'https']
            });
            break;

        case CustomFieldType.BOOLEAN:
            createItemSchemaData[prefix] = Joi.boolean();
            break;

    }
});

export const createItemSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    ...createItemSchemaData,
}).required()

export const updateItemSchema = Joi.object({
    version: Joi.number().integer().required(),
    customId: Joi.string(),
    ...createItemSchemaData,
}).required()

export const getItemListSchema = Joi.object({
    inventoryId: Joi.number().integer().required(),
    sortBy: Joi.string(),
    sortAsc: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(50).default(10),
});