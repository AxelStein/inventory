import express from 'express';
import controller from '../../../inventory/tag/tag.controller.js';

const router = express.Router();
router.post('/create', controller.create);
router.delete('/:id', controller.delete);
router.get('/list', controller.getList);

export default router;