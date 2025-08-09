import express from 'express';
import controller from '../../../inventory/custom_id/custom.id.controller.js';

const router = express.Router();
router.post('/create', controller.create);
router.post('/:id/update', controller.update);
router.delete('/:id', controller.delete);
router.get('/list', controller.getList);
router.put('/reorder', controller.reorder);

export default router;