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
import { validateBody, validateParams, validateQuery } from '../../../middleware/request.validator.js';
import {
    checkInventoryParamsSchema,
    createInventorySchema,
    deleteImageSchema,
    getInventoryListSchema, 
    searchInventorySchema, 
    updateInventorySchema, 
    uploadImageSchema
} from '../../../inventory/inventory.schemas.js';
import customFieldValidator from '../../../middleware/custom.field.validator.js';
import inventoryImageUploader from '../../../middleware/inventory.image.uploader.js';
import validateImageUpload from '../../../middleware/image.uploader.validator.js';

const router = express.Router();

router.get(
    '/list',
    validateQuery(getInventoryListSchema),
    controller.getList
);

router.get(
    '/search',
    validateQuery(searchInventorySchema),
    controller.search
);

router.get(
    '/by-id/:inventoryId',
    validateParams(checkInventoryParamsSchema),
    controller.getById
);

router.post(
    '/create',
    validateBody(createInventorySchema),
    customFieldValidator,
    controller.create
);

router.post(
    '/:inventoryId/update',
    validateParams(checkInventoryParamsSchema),
    validateBody(updateInventorySchema),
    customFieldValidator,
    checkInventoryAccess(AccessAction.UPDATE),
    controller.update
);

router.post(
    '/:inventoryId/upload-image',
    validateParams(checkInventoryParamsSchema),
    validateQuery(uploadImageSchema),
    checkInventoryAccess(AccessAction.UPDATE),
    inventoryImageUploader,
    validateImageUpload,
    controller.uploadImage
);

router.delete(
    '/:inventoryId',
    validateParams(checkInventoryParamsSchema),
    checkInventoryAccess(AccessAction.DELETE),
    controller.delete
);

router.delete(
    '/:inventoryId/delete-image',
    validateParams(checkInventoryParamsSchema),
    validateQuery(deleteImageSchema),
    checkInventoryAccess(AccessAction.UPDATE),
    controller.deleteImage
)

router.use('/item', itemRouter);
router.use('/tag', tagRouter);
router.use('/category', categoryRouter);
router.use('/post', postRouter);
router.use('/write-access', writeAccessRouter);
router.use('/custom-id', customIdRouter);

export default router;