import express from 'express';
import controller from '../../auth/auth.controller.js';

const router = express.Router();
router.post('/sign-in', controller.signIn);
router.post('/sign-up', controller.signUp);
router.post('/sign-out', controller.signOut);
router.post('/google/sign-in', controller.googleSignIn);
router.post('/github/sign-in', controller.githubSignIn);

export default router;