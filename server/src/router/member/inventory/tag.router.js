import express from 'express';
import controller from '../../../inventory/tag/tag.controller.js';
import { checkTagAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';
import {validateBody, validateParams, validateQuery} from "../../../middleware/request.validator.js";
import {createTagSchema, deleteTagSchema, getInventoryTagsSchema} from "../../../inventory/tag/tag.schemas.js";

const router = express.Router();

router.post(
    '/create',
    validateBody(createTagSchema),
    checkTagAccess(AccessAction.CREATE),
    controller.create
);

router.delete(
    '/:id/from-inventory/:inventoryId',
    validateParams(deleteTagSchema),
    checkTagAccess(AccessAction.DELETE),
    controller.delete
);

router.get(
    '/list/from-inventory/:inventoryId',
    validateParams(getInventoryTagsSchema),
    checkTagAccess(AccessAction.READ),
    controller.getFromInventory
);

export default router;