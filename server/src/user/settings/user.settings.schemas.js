import Joi from "joi";
import {appConfig} from "../../app/app.config.js";

export const saveUserSettingsSchema = Joi.object({
    theme: Joi.string().valid(...appConfig.themes),
    locale: Joi.string().valid(...appConfig.languages.map(l => l.locale)),
}).required();