import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import express from 'express';
import service from '../user/user.service.js';

/**
 * @param {express.Request} req 
 * @returns {string|null} token
 */
const cookieTokenExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
}
/**
 * @returns {JwtStrategy}
 */
export function createPassportJwtStrategy() {
    return new JwtStrategy({
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: cookieTokenExtractor,
    }, async (payload, done) => {
        service.getVerified(payload.id)
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
        service.getOrCreateWithGoogle(
            profile.id,
            profile.displayName,
            profile.emails[0].value,
            profile.emails[0].verified,
        )
            .then(user => done(null, user))
            .catch(err => done(err, null));
    });
}