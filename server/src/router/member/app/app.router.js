import express from 'express';
import appConfigController from "../../../app/app.config.controller.js";

const router = express.Router();
router.get('/config', appConfigController.getConfig);
export default router;