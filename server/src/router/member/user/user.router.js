import express from 'express';
import controller from '../../../user/user.controller.js';
import settingsRouter from "./settings/user.settings.router.js";
import userAccountRouter from "./account/user.account.router.js";
import {validateQuery} from "../../../middleware/request.validator.js";
import {searchUsersSchema} from "../../../user/user.schemas.js";

const router = express.Router();
router.get('/search', validateQuery(searchUsersSchema), controller.search);
router.use('/settings', settingsRouter);
router.use('/account', userAccountRouter);

export default router;