import express from 'express';
import controller from '../../../inventory/post/post.controller.js';
import commentRouter from './post.comment.router.js';

const router = express.Router();
router.post('/create', controller.create);
router.post('/:id/update', controller.update);
router.delete('/:id', controller.delete);
router.get('/list', controller.getList);

router.use('/comment', commentRouter);

export default router;