import express from 'express';
import controller from '../../../inventory/post/post.controller.js';
import { checkPostAccess } from '../../../middleware/check.access.js';
import AccessAction from '../../../inventory/access/access.action.js';
import {validateBody, validateParams, validateQuery} from "../../../middleware/request.validator.js";
import {
    createPostSchema,
    getPostsSchema,
    postIdSchema, postPusherAuthSchema,
    updatePostSchema
} from "../../../inventory/post/post.schemas.js";
import {validatePostPusherAuth} from "../../../middleware/post.pusher.auth.validator.js";

const router = express.Router();

router.post(
    '/create',
    validateBody(createPostSchema),
    checkPostAccess(AccessAction.CREATE),
    controller.create
);

router.post(
    '/:id/update',
    validateParams(postIdSchema),
    validateBody(updatePostSchema),
    checkPostAccess(AccessAction.UPDATE),
    controller.update
);

router.delete(
    '/:id',
    validateParams(postIdSchema),
    checkPostAccess(AccessAction.DELETE),
    controller.delete
);

router.get(
    '/list',
    validateQuery(getPostsSchema),
    checkPostAccess(AccessAction.READ),
    controller.getList
);

router.get(
    '/:id',
    validateParams(postIdSchema),
    checkPostAccess(AccessAction.READ),
    controller.getById
);

router.post(
    '/pusher/auth',
    validateBody(postPusherAuthSchema),
    validatePostPusherAuth,
    validateBody(postPusherAuthSchema),
    checkPostAccess(AccessAction.READ),
    controller.authPusher
);

export default router;