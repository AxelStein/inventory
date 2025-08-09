import express from 'express';
import controller from '../../../inventory/post/post.controller.js';
import commentRouter from './post.comment.router.js';
import { inventoryPostCheckAccess } from '../../../middleware/inventory.check.access.js';
import { POST } from '../../../inventory/access/inventory.access.control.js';

const router = express.Router();
router.post('/create', inventoryPostCheckAccess('createOwn', POST), controller.create);
router.post('/:id/update', inventoryPostCheckAccess('updateOwn', POST), controller.update);
router.delete('/:id', controller.delete);
router.get('/list', controller.getList);

router.use('/comment', commentRouter);

export default router;