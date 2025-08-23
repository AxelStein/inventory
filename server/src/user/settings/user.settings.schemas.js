import Joi from "joi";
import {appConfig} from "../../app/app.config.js";

export const saveUserSettingsSchema = Joi.object({
    nightMode: Joi.boolean(),
    language: Joi.string().valid(...appConfig.languages.map(l => l.locale)),
}).required();