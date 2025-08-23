import express from 'express';
import controller from '../../user/user.controller.js';
import userSettingsController from "../../user/settings/user.settings.controller.js";
import {validateBody} from "../../middleware/request.validator.js";
import {saveUserSettingsSchema} from "../../user/settings/user.settings.schemas.js";

const router = express.Router();
router.get('/search', controller.searchUser);
router.post(
    '/settings/save',
    validateBody(saveUserSettingsSchema),
    userSettingsController.save
);

router.delete('/account', controller.deleteAccount);
router.get('/account/own', controller.getOwnAccount);
router.get('/account/:id', controller.getUserAccount);

export default router;