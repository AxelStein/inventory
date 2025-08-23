import express from 'express';
import passport from "passport";
import authController from "../../auth/auth.controller.js";

const router = express.Router();

router.get(
    '/',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    authController.googleSignIn
);

export default router;
