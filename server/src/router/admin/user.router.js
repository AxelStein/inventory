import express from 'express';
import controller from '../../user/user.controller.js';
import {validateBody, validateQuery} from "../../middleware/request.validator.js";
import {
    blockUsersByIdsSchema,
    changeUserRoleByIdsSchema,
    deleteUsersByIdsSchema,
    getUserListSchema
} from "../../user/user.schemas.js";

const router = express.Router();
router.post('/block-by-ids', validateBody(blockUsersByIdsSchema), controller.blockByIds);
router.post('/change-role-by-ids', validateBody(changeUserRoleByIdsSchema), controller.changeRoleByIds);
router.post('/delete-by-ids', validateBody(deleteUsersByIdsSchema), controller.deleteByIds);
router.get('/list', validateQuery(getUserListSchema), controller.getList);

export default router;