import express from 'express';
import controller from "../../../../user/user.controller.js";
import {validateParams} from "../../../../middleware/request.validator.js";
import {userIdSchema} from "../../../../user/user.schemas.js";

const router = express.Router();
router.delete('/', controller.deleteOwnAccount);
router.get('/own', controller.getOwnAccount);
router.get('/:id', validateParams(userIdSchema), controller.getAccountById);
export default router;