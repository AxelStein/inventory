import express from 'express';
import userRouter from './user/user.router.js';
import inventoryRouter from './inventory/inventory.router.js';
import salesForceRouter from './salesforce/salesforce.router.js';

const router = express.Router();
router.use('/inventory', inventoryRouter);
router.use('/user', userRouter);
router.use('/salesforce', salesForceRouter);

export default router;