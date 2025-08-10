import express from 'express';
import controller from '../../../inventory/write_access/write.access.controller.js';
import { checkWriteAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';

const router = express.Router();
router.post('/create', checkWriteAccess(AccessAction.CREATE), controller.create);
router.delete('/:id', checkWriteAccess(AccessAction.DELETE), controller.delete);
router.get('/list', checkWriteAccess(AccessAction.READ), controller.getList);

export default router;