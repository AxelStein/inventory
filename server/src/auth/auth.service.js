import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from '../user/user.service.js';
import {ApiError, GoneError, UnauthorizedError} from '../error/index.js';
import passwordResetRepository from "./password_reset/password.reset.repository.js";
import db from "../db/index.js";
import emailService from "./email.service.js";

const passwordResetExpireTime = 3600000;

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
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedError('Invalid credentials');
        }
        return createToken(user);
    },

    signUp: async (name, email, password) => createToken(
        await userService.create(
            name,
            email,
            await bcrypt.hash(password, 10)
        )
    ),

    googleSignIn: async (user) => createToken(user),

    resetPassword: (email) => db.transaction(async (transaction) => {
        const user = await userService.getByEmail(email, transaction);
        if (!user) {
            return;
        }

        await passwordResetRepository.delete(user.id, transaction);

        const passwordReset = {
            userId: user.id,
            token: crypto.randomBytes(32).toString('hex'),
            expiresAt: new Date(Date.now() + passwordResetExpireTime)
        };

        await passwordResetRepository.create(passwordReset, transaction);

        await emailService.sendRestorePasswordEmail(email, passwordReset.token);
    }),

    restorePassword: async (token, password) => db.transaction(async (transaction) => {
        const data = await passwordResetRepository.get(token, transaction);
        if (!data || data.expiresAt < new Date()) {
            if (data) {
                await passwordResetRepository.delete(data.userId);
            }
            throw new GoneError('Password restore request is expired');
        }

        await userService.updateUserPassword(data.userId, await bcrypt.hash(password, 10), transaction);

        await passwordResetRepository.delete(data.userId, transaction);
    })
}

export default service;