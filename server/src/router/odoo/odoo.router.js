import express from 'express';
import controller from '../../inventory/inventory.controller.js';
import { validateQuery } from '../../middleware/request.validator.js';
import { getByOdooTokenSchema } from '../../inventory/inventory.schemas.js';

const router = express.Router();
router.get(
    '/inventory',
    validateQuery(getByOdooTokenSchema),
    controller.getByOdooToken
);
export default router;