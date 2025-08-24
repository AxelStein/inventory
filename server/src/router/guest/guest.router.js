import express from 'express';
import authRouter from './auth.router.js';
import inventoryRouter from './inventory.router.js';
import appRouter from "./app/app.router.js";

const router = express.Router();
router.use('/auth', authRouter);
router.use('/inventory', inventoryRouter);
router.use('/app', appRouter);

export default router;