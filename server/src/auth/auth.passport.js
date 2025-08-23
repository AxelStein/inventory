import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import authService from "./auth.service.js";
import {AUTH_PROVIDER} from "./auth.provider.js";

const cookieTokenExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
}

export function createPassportJwtStrategy() {
    return new JwtStrategy({
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: cookieTokenExtractor,
    }, async (payload, done) => {
        authService.getVerified(payload.id)
            .then(user => done(null, user))
            .catch(err => done(err, null));
    });
}

export function createPassportGoogleStrategy() {
    return new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        authService.getOrCreateWithProvider(
            AUTH_PROVIDER.GOOGLE,
            profile.id,
            profile.displayName,
            profile.emails?.[0]?.value
        ).then(user => done(null, user)).catch(err => done(err, null));
    });
}

export function createFacebookStrategy() {
    return new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'email'],
    }, async (accessToken, refreshToken, profile, done) => {
        authService.getOrCreateWithProvider(
            AUTH_PROVIDER.FACEBOOK,
            profile.id,
            profile.displayName,
            profile.emails?.[0]?.value
        ).then(user => done(null, user)).catch(err => done(err, null));
    });
}