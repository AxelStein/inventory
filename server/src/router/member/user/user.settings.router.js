import express from 'express';
import controller from "../../../user/settings/user.settings.controller.js";
import {validateBody} from "../../../middleware/request.validator.js";
import {saveUserSettingsSchema} from "../../../user/settings/user.settings.schemas.js";

const router = express.Router();
router.post('/save', validateBody(saveUserSettingsSchema), controller.save);
router.get('/', controller.getForUser);
export default router;