import express from 'express';
import inventoryController from '../../inventory/inventory.controller.js';
import itemController from '../../inventory/item/item.controller.js';
import {validateParams, validateQuery} from '../../middleware/request.validator.js';
import { getItemListSchema } from '../../inventory/item/item.schemas.js';
import {checkInventoryParamsSchema, getInventoryListSchema} from "../../inventory/inventory.schemas.js";

const router = express.Router();
router.get(
    '/list',
    validateQuery(getInventoryListSchema),
    inventoryController.getList
);
router.get(
    '/by-id/:inventoryId',
    validateParams(checkInventoryParamsSchema),
    inventoryController.getById
);
router.get(
    '/item/list',
    validateQuery(getItemListSchema),
    itemController.getList
);

export default router;