import { Strategy as JwtStrategy } from "passport-jwt";
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
        service.getNotBlocked(payload.id)
            .then(user => done(null, user))
            .catch(err => done(err, null));
    });
}