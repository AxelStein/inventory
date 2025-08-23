import express from 'express';
import {AUTH_PROVIDER} from "../../auth/auth.provider.js";
import passport from "passport";
import authController from "../../auth/auth.controller.js";

const router = express.Router();

Object.values(AUTH_PROVIDER).forEach(provider => {
   router.get(`/${provider.id}`, passport.authenticate(provider.id, { scope: provider.scope }));
   router.get(
       `/${provider.id}/callback`,
       passport.authenticate(provider.id, { session: false, failureRedirect: '/login' }),
       authController.providerSignIn
   );
});

export default router;