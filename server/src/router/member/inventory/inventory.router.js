import express from 'express';
import itemRouter from './item.router.js';
import tagRouter from './tag.router.js';
import categoryRouter from './category.router.js';
import postRouter from './post.router.js';
import writeAccessRouter from './write.access.router.js';
import customIdRouter from './custom.id.router.js';
import controller from '../../../inventory/inventory.controller.js';
import { checkInventoryAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';

const router = express.Router();
router.get('/list', controller.getList);
router.post('/create', controller.create);
router.post('/:inventoryId/update', checkInventoryAccess(AccessAction.UPDATE), controller.update);
router.post('/:inventoryId/upload-image', checkInventoryAccess(AccessAction.UPDATE), controller.uploadImage);
router.delete('/:inventoryId', checkInventoryAccess(AccessAction.DELETE), controller.delete);

router.use('/item', itemRouter);
router.use('/tag', tagRouter);
router.use('/category', categoryRouter);
router.use('/post', postRouter);
router.use('/write-access', writeAccessRouter);
router.use('/custom-id', customIdRouter);

export default router;