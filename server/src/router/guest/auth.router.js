import express from 'express';
import controller from '../../auth/auth.controller.js';
import { validateBody } from '../../middleware/request.validator.js';
import { signInSchema, signUpSchema } from '../../auth/auth.schemas.js';

const router = express.Router();
router.post('/sign-in', validateBody(signInSchema), controller.signIn);
router.post('/sign-up', validateBody(signUpSchema), controller.signUp);
router.post('/sign-out', controller.signOut);

export default router;