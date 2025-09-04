import { CustomFieldState, CustomFieldType } from "../inventory/inventory.custom.field.js";
import CustomIdType from "../inventory/custom_id/custom.id.type.js";

export const appConfig = {
    inventory: {
        imageConstraints: {
            mimeTypes: [
                'image/jpg',
                'image/jpeg',
                'image/png',
                'image/webp'
            ],
            maxFileSize: 2 * 1024 * 1024
        },
        customField: {
            types: Object.values(CustomFieldType),
            states: Object.values(CustomFieldState)
        },
        customIdTypes: Object.values(CustomIdType)
    },
    languages: [
        {
            locale: 'en-US',
            name: 'English',
            default: true,
        },
        {
            locale: 'ru-RU',
            name: 'Русский',
        },
    ],
    themes: [
        'light',
        'dark'
    ],
}