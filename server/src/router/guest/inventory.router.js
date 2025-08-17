import express from 'express';
import inventoryController from '../../inventory/inventory.controller.js';
import itemController from '../../inventory/item/item.controller.js';
import { validateQuery } from '../../middleware/request.validator.js';
import { getItemListSchema } from '../../inventory/item/item.schemas.js';

const router = express.Router();
router.get('/list', inventoryController.getList);
router.get('/by-id/:inventoryId', inventoryController.getById);
router.get('/item/list', validateQuery(getItemListSchema), itemController.getList);

export default router;