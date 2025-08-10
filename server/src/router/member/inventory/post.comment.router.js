import express from 'express';
import controller from '../../../inventory/post/comment/comment.controller.js';
import { checkPostCommentAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';

const router = express.Router();
router.post('/create', checkPostCommentAccess(AccessAction.CREATE), controller.create);
router.post('/:id/update', checkPostCommentAccess(AccessAction.UPDATE), controller.update);
router.delete('/:id', checkPostCommentAccess(AccessAction.DELETE), controller.delete);
router.get('/list', checkPostCommentAccess(AccessAction.READ), controller.getList);

export default router;