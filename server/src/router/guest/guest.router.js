import express from 'express';
import authRouter from './auth.router.js';
import inventoryRouter from './inventory.router.js';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/inventory', inventoryRouter);

export default router;