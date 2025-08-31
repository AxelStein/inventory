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
        }
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
    ]
}