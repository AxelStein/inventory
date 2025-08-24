import { Strategy as JwtStrategy } from "passport-jwt";
import authService from "./auth.service.js";

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