import express from 'express';
import controller from '../../../inventory/custom_id/custom.id.controller.js';
import { checkCustomIdAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';

const router = express.Router();
router.post('/create', checkCustomIdAccess(AccessAction.CREATE), controller.create);
router.post('/:id/update', checkCustomIdAccess(AccessAction.UPDATE), controller.update);
router.delete('/:id', checkCustomIdAccess(AccessAction.DELETE), controller.delete);
router.get('/list', checkCustomIdAccess(AccessAction.READ), controller.getList);
router.put('/reorder', checkCustomIdAccess(AccessAction.UPDATE), controller.reorder);

export default router;