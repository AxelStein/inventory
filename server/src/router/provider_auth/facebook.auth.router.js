import express from 'express';
import passport from "passport";
import authController from "../../auth/auth.controller.js";

const router = express.Router();

router.get('/', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
    '/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
    authController.facebookSignIn
);

export default router;
