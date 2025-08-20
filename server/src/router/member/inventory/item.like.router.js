import express from 'express';
import controller from '../../../inventory/item/like/item.like.controller.js';
import {validateParams} from "../../../middleware/request.validator.js";
import {itemLikeSchema} from "../../../inventory/item/like/item.like.schemas.js";

const router = express.Router();
router.post('/:id', validateParams(itemLikeSchema), controller.create);
router.delete('/:id', validateParams(itemLikeSchema), controller.delete);

export default router;