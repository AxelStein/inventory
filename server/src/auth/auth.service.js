import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from '../user/user.service.js';
import { UnauthorizedError } from '../error/index.js';

const createToken = (user) => new Promise((resolve, reject) => {
    jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { algorithm: 'HS256' },
        (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    user: {
                        id: user.id,
                        avatar: user.avatar,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        isBlocked: user.isBlocked,
                        lastSeen: user.lastSeen,
                    },
                    token
                });
            }
        }
    );
});

const service = {

    signIn: async (email, password) => {
        const user = await userService.getByEmail(email);
        if (!user || !await bcrypt.compare(password, user.password) || user.isBlocked) {
            throw new UnauthorizedError('Invalid credentials');
        }
        return createToken(user);
    },

    signUp: async (name, email, password) => {
        return createToken(await userService.create(name, email, await bcrypt.hash(password, 10)));
    },
}

export default service;