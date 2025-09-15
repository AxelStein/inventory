import express from 'express';
import controller from '../../../support/support.controller.js';
import { validateBody } from '../../../middleware/request.validator.js';
import { createSupportTicketSchema } from '../../../support/support.schemas.js';

const router = express.Router();
router.post(
    '/ticket/create',
    validateBody(createSupportTicketSchema),
    controller.createTicket
);
export default router;