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
    await emailService.sendVerificationEmail(user.email, verification.code);
    return {
        userId: user.id,
        message: 'Signup verification code has been sent. Check your email.',
        status: 'verification_code_sent'
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
            throw new UnauthorizedError('Invalid credentials');
        }
        if (!user.verified) {
            return createRequiresVerificationStatus(user, transaction);
        }
        return createToken(user);
    }),

    signUp: async (name, email, password) => db.transaction(async (transaction) => {
        const user = await userRepository.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        }, transaction);
        await userSettingsService.createDefault(user.id, transaction);
        return createRequiresVerificationStatus(user, transaction);
    }),

    getOrCreateWithProvider: (provider, id, name, email) => db.transaction(async (transaction) => {
        const providerAttr = `${provider.id}Id`;
        let user = await userRepository.getVerified({ [providerAttr]: id }, transaction, Transaction.LOCK.UPDATE);
        if (user) {
            return user;
        }
        user = await userRepository.create({ [providerAttr]: id, name, email, verified: true }, transaction);
        await userSettingsService.createDefault(user.id, transaction);
        return user;
    }),

    providerSignIn: async (user) => createToken(user),

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
            throw new GoneError('Password restore request is expired');
        }

        await userRepository.updateUserPassword(data.userId, await bcrypt.hash(password, 10), transaction);

        await passwordResetRepository.delete(data.userId, transaction);
    }),

    verifyEmail: async (userId, code) => db.transaction(async (transaction) => {
        const verification = await emailVerificationRepository.get(userId, code, transaction, Transaction.LOCK.UPDATE);
        if (!verification) {
            throw new ValidationError('Invalid code');
        }
        await verification.destroy({ transaction });

        const user = await userRepository.getNotBlocked(userId, transaction);
        user.verified = true;
        await user.save({ transaction });

        return createToken(user);
    })
}

export default service;