import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import authService from "./auth.service.js";

const tokenExtractor = (req) => {
    let token = null;
    if (req) {
        if (req.cookies) {
            token = req.cookies['token'];
        }
        if (!token) {
            token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        }
    }
    return token;
}

export function createPassportJwtStrategy() {
    return new JwtStrategy({
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: tokenExtractor,
    }, async (payload, done) => {
        authService.getVerified(payload.id)
            .then(user => done(null, user))
            .catch(err => done(err, null));
    });
}