import express from 'express';
import controller from '../../../inventory/post/comment/comment.controller.js';

const router = express.Router();
router.post('/create', controller.create);
router.post('/:id/update', controller.update);
router.delete('/:id', controller.delete);
router.get('/list', controller.getList);

export default router;