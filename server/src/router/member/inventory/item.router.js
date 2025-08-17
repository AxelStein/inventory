import express from 'express';
import itemLikeRouter from './item.like.router.js';
import controller from '../../../inventory/item/item.controller.js';
import { checkItemAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';
import { validateQuery } from '../../../middleware/request.validator.js';
import { getItemListSchema } from '../../../inventory/item/item.schemas.js';

const router = express.Router();
router.get('/list', validateQuery(getItemListSchema), controller.getList);
router.post('/create', checkItemAccess(AccessAction.CREATE), controller.create);
router.post('/:id/update', checkItemAccess(AccessAction.UPDATE), controller.update);
router.delete('/:id', checkItemAccess(AccessAction.DELETE), controller.delete);

router.use('/like', itemLikeRouter);

export default router;