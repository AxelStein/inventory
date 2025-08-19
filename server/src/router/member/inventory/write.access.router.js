import express from 'express';
import controller from '../../../inventory/write_access/write.access.controller.js';
import { checkWriteAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';
import {validateBody, validateParams, validateQuery} from "../../../middleware/request.validator.js";
import {
    createWriteAccessSchema, checkWriteAccessParamsSchema,
    getWriteAccessListSchema
} from "../../../inventory/write_access/write.access.schemas.js";

const router = express.Router();

router.post(
    '/create',
    validateBody(createWriteAccessSchema),
    checkWriteAccess(AccessAction.CREATE),
    controller.create
);

router.delete(
    '/:id',
    validateParams(checkWriteAccessParamsSchema),
    checkWriteAccess(AccessAction.DELETE),
    controller.delete
);

router.get(
    '/list',
    validateQuery(getWriteAccessListSchema),
    checkWriteAccess(AccessAction.READ),
    controller.getList
);

export default router;