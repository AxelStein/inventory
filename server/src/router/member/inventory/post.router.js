import express from 'express';
import controller from '../../../inventory/post/post.controller.js';
import commentRouter from './post.comment.router.js';
import { checkPostAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';

const router = express.Router();
router.post('/create', checkPostAccess(AccessAction.CREATE), controller.create);
router.post('/:id/update', checkPostAccess(AccessAction.UPDATE), controller.update);
router.delete('/:id', checkPostAccess(AccessAction.DELETE), controller.delete);
router.get('/list', checkPostAccess(AccessAction.READ), controller.getList);
router.use('/comment', commentRouter);

export default router;