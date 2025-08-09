import express from 'express';
import itemLikeRouter from './item.like.router.js';
import controller from '../../../inventory/item/item.controller.js';

const router = express.Router();
router.get('/list', controller.getList);
router.post('/create', controller.create);
router.post('/:id/update', controller.update);
router.delete('/:id', controller.delete);

router.use('/like', itemLikeRouter);

export default router;