import express from 'express';
import controller from '../../../inventory/item/like/item.like.controller.js';

const router = express.Router();
router.post('/:id', controller.create);
router.delete('/:id', controller.delete);
router.get('/', controller.getList);

export default router;