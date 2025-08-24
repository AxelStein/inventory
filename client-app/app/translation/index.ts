import i18next from "i18next";
import {initReactI18next} from "react-i18next";
import translationRU from './locales/ru-RU.json';
import translationEN from './locales/en-US.json';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            'en-US': {
                translation: translationEN,
            },
            'ru-RU': {
                translation: translationRU,
            },
        },
        debug: true,
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        }
    });

export default i18next;