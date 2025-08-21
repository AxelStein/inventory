import express from 'express';
import controller from '../../../inventory/post/comment/comment.controller.js';
import { checkPostCommentAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';
import {validateBody, validateParams, validateQuery} from "../../../middleware/request.validator.js";
import {
    commentIdSchema,
    createCommentSchema, getCommentsSchema,
    updateCommentSchema
} from "../../../inventory/post/comment/comment.schemas.js";

const router = express.Router();

router.post(
    '/create',
    validateBody(createCommentSchema),
    checkPostCommentAccess(AccessAction.CREATE),
    controller.create
);

router.post(
    '/:id/update',
    validateParams(commentIdSchema),
    validateBody(updateCommentSchema),
    checkPostCommentAccess(AccessAction.UPDATE),
    controller.update
);

router.delete(
    '/:id',
    validateParams(commentIdSchema),
    checkPostCommentAccess(AccessAction.DELETE),
    controller.delete
);

router.get(
    '/list',
    validateQuery(getCommentsSchema),
    checkPostCommentAccess(AccessAction.READ),
    controller.getList
);

export default router;