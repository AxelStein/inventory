import express from 'express';
import itemLikeRouter from './item.like.router.js';
import controller from '../../../inventory/item/item.controller.js';
import { checkItemAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';
import {validateBody, validateParams, validateQuery} from '../../../middleware/request.validator.js';
import {
    getItemListSchema,
    createItemSchema,
    updateItemSchema,
    checkItemParamsSchema
} from '../../../inventory/item/item.schemas.js';

const router = express.Router();
router.get('/list', validateQuery(getItemListSchema), controller.getList);

router.post(
    '/create', 
    validateBody(createItemSchema),
    checkItemAccess(AccessAction.CREATE),  
    controller.create
);

router.post(
    '/:id/update',
    validateParams(checkItemParamsSchema),
    validateBody(updateItemSchema),
    checkItemAccess(AccessAction.UPDATE),  
    controller.update
);

router.delete('/:id',
    validateParams(checkItemParamsSchema),
    checkItemAccess(AccessAction.DELETE),
    controller.delete
);

router.use('/like', itemLikeRouter);

export default router;