import express from 'express';
import googleAuthRouter from "./google.auth.router.js";
import facebookAuthRouter from "./facebook.auth.router.js";

const router = express.Router();
router.use('/google', googleAuthRouter);
router.use('/facebook', facebookAuthRouter);
export default router;