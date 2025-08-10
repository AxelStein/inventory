import express from 'express';
import controller from '../../../inventory/tag/tag.controller.js';
import { checkTagAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';

const router = express.Router();
router.post('/create', checkTagAccess(AccessAction.CREATE), controller.create);
router.delete('/:id/from-inventory/:inventoryId', checkTagAccess(AccessAction.DELETE), controller.delete);
router.get('/list', checkTagAccess(AccessAction.READ), controller.getList);

export default router;