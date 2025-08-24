import express from 'express';
import userRouter from './user/user.router.js';
import inventoryRouter from './inventory/inventory.router.js';
import appRouter from "../guest/app/app.router.js";

const router = express.Router();
router.use('/inventory', inventoryRouter);
router.use('/user', userRouter);

export default router;