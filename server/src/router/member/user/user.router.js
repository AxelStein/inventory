import express from 'express';
import controller from '../../../user/user.controller.js';
import settingsRouter from "./user.settings.router.js";

const router = express.Router();
router.get('/search', controller.searchUser);
router.delete('/account', controller.deleteAccount);
router.get('/account/own', controller.getOwnAccount);
router.get('/account/:id', controller.getUserAccount);
router.use('/settings', settingsRouter);

export default router;