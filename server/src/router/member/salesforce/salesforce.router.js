import express from 'express';
import controller from '../../../salesforce/salesforce.controller.js';
import { validateBody } from '../../../middleware/request.validator.js';
import { createAccountSchema } from '../../../salesforce/salesforce.schemas.js';
import { checkCreateSalesforceAccount } from '../../../middleware/check.create.salesforce.js';

const router = express.Router();
router.post(
    '/account/create',
    validateBody(createAccountSchema),
    checkCreateSalesforceAccount(),
    controller.createAccount
);
router.get('/account', controller.getAccount);
export default router;