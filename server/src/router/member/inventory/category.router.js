import express from 'express';
import controller from '../../../inventory/category/category.controller.js';

const router = express.Router();
router.get('/list', controller.getList);

export default router;