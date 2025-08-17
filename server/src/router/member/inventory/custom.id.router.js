import express from 'express';
import controller from '../../../inventory/custom_id/custom.id.controller.js';
import { checkCustomIdAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';
import {validateBody, validateQuery} from "../../../middleware/request.validator.js";
import {createCustomIdSchema, getCustomIdsSchema} from "../../../inventory/custom_id/custom.id.schemas.js";

const router = express.Router();

router.post(
    '/create',
    validateBody(createCustomIdSchema),
    checkCustomIdAccess(AccessAction.CREATE),
    controller.create
);

router.post(
    '/:id/update',
    checkCustomIdAccess(AccessAction.UPDATE),
    controller.update
);

router.delete(
    '/:id',
    checkCustomIdAccess(AccessAction.DELETE),
    controller.delete
);

router.get(
    '/list',
    validateQuery(getCustomIdsSchema),
    checkCustomIdAccess(AccessAction.READ),
    controller.getList
);

router.put(
    '/reorder',
    checkCustomIdAccess(AccessAction.UPDATE),
    controller.reorder
);

export default router;