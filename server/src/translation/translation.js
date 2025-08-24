import i18n from 'i18n';
import {appConfig} from "../app/app.config.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
    locales: appConfig.languages.map(e => e.locale),
    defaultLocale: appConfig.languages.find(e => e.default).locale,
    directory: path.join(__dirname, 'locales'),
    autoReload: true,
    objectNotation: true,
    register: global,
});

export default i18n;