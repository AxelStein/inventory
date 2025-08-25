import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {GoneError, UnauthorizedError, ValidationError} from '../error/index.js';
import passwordResetRepository from "./password_reset/password.reset.repository.js";
import db from "../db/index.js";
import emailService from "./email.service.js";
import emailVerificationRepository from "./email_verification/email.verification.repository.js";
import {generateRandomNumberForCustomId} from "../inventory/custom_id/custom.id.random.number.generator.js";
import CustomIdType from "../inventory/custom_id/custom.id.type.js";
import {Transaction} from "sequelize";
import userSettingsService from "../user/settings/user.settings.service.js";
import userRepository from "../user/user.repository.js";
import crypto from "crypto";
import {OAuth2Client} from 'google-auth-library';

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

const createRequiresVerificationStatus = async (user, transaction) => {
    const verification = await emailVerificationRepository.create({
        userId: user.id,
        code: generateRandomNumberForCustomId(CustomIdType.RND_6_DIGIT)
    }, transaction);
    if (!user.email) {
        throw new ValidationError(__('auth.error.userHasNoEmail'));
    }
    await emailService.sendVerificationEmail(user.email, verification.code);
    return {
        userId: user.id,
        status: 'verification_code_sent',
        email: user.email,
    };
};

const service = {

    getVerified: async (id) => {
        const user = await userRepository.getVerified({ id });
        if (user) {
            await userRepository.updateLastSeenDate(user.id);
        }
        return user;
    },

    signIn: async (email, password) => db.transaction(async (transaction) => {
        const user = await userRepository.getByEmail(email);
        if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedError(__('auth.error.invalidCredentials'));
        }
        if (!user.verified) {
            return createRequiresVerificationStatus(user, transaction);
        }
        return createToken(user);
    }),

    signUp: async (name, email, password, locale) => db.transaction(async (transaction) => {
        const user = await userRepository.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        }, transaction);

        await userSettingsService.createDefault(user.id, locale, transaction);

        return createRequiresVerificationStatus(user, transaction);
    }),

    signInWithGoogle: (token, locale) => db.transaction(async (transaction) => {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (error) {
            throw new ValidationError(__('auth.error.invalidToken'));
        }

        const googleId = ticket.getUserId();
        if (!googleId) {
            throw new UnauthorizedError(__('auth.error.invalidCredentials'));
        }
        const { email, name, email_verified } = ticket.getPayload();

        let user = await userRepository.getVerified({ googleId }, transaction, Transaction.LOCK.UPDATE);
        if (user) {
            return createToken(user);
        }
        user = await userRepository.create({
            name,
            email,
            verified: email_verified,
            googleId,
        }, transaction);

        await userSettingsService.createDefault(user.id, locale, transaction);

        if (!user.verified) {
            return createRequiresVerificationStatus(user, transaction);
        }
        return createToken(user);
    }),

    resetPassword: (email) => db.transaction(async (transaction) => {
        const user = await userRepository.getByEmail(email, transaction);
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
            throw new GoneError(__('auth.error.restorePasswordExpired'));
        }

        await userRepository.updateUserPassword(data.userId, await bcrypt.hash(password, 10), transaction);

        await passwordResetRepository.delete(data.userId, transaction);
    }),

    verifyEmail: async (userId, code) => db.transaction(async (transaction) => {
        const verification = await emailVerificationRepository.get(userId, code, transaction, Transaction.LOCK.UPDATE);
        if (!verification) {
            const message = __('auth.error.invalidCode');
            throw new ValidationError(message, { code: message });
        }
        await verification.destroy({ transaction });

        const user = await userRepository.getNotBlocked(userId, transaction);
        user.verified = true;
        await user.save({ transaction });

        return createToken(user);
    })
}

export default service;