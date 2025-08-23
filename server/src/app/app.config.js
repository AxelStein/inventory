export const appConfig = {
    inventoryImage: {
        mimeTypes: [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/webp'
        ],
        maxFileSize: 2 * 1024 * 1024
    },
    languages: [
        {
            locale: 'en',
            name: 'English',
            default: true,
        },
        {
            locale: 'ru',
            name: 'Русский',
        },
    ],
    themes: [
        'light',
        'dark'
    ]
}