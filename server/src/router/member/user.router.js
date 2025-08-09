import express from 'express';
import controller from '../../user/user.controller.js';

const router = express.Router();
router.get('/search', controller.searchUser);
router.post('/settings/save', controller.saveSettings);

router.delete('/account', controller.deleteAccount);
router.get('/account/own', controller.getOwnAccount);
router.get('/account/:id', controller.getUserAccount);

export default router;