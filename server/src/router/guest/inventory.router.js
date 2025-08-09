import express from 'express';
import inventoryController from '../../inventory/inventory.controller.js';
import itemController from '../../inventory/item/item.controller.js';

const router = express.Router();
router.get('/list', inventoryController.getList);
router.get('/item/list', itemController.getList);

export default router;