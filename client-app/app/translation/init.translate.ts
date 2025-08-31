import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import I18NextHttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';

const publicUrl = import.meta.env.VITE_PUBLIC_URL;

i18next
    .use(ChainedBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        },
        backend: {
            backends: [
                I18NextHttpBackend
            ],
            backendOptions: [{
                loadPath: `${publicUrl}/locales/{{lng}}.json`,
                crossDomain: true,
            }],
        }
    });

export default i18next;