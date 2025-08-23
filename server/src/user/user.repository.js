import User from './user.model.js';

const repository = {

    getNotBlocked: (id) => User.findOne({
        where: { id, isBlocked: false },
        raw: true
    }),

    updateLastSeenDate: (id) => User.update({ lastSeen: new Date() }, { where: { id } }),

    updateUserPassword: (userId, password, transaction = null) => User.update(
        { password },
        { where: { id: userId }, transaction }
    ),

    getByEmail: (email, transaction = null) => User.findOne({
        attributes: { include: ['password'] },
        where: { email, isBlocked: false },
        raw: true,
        transaction
    }),

    create: (name, email, password) => User.create({ name, email, password }, { raw: true }),

    getOrCreateWithGoogle: async (googleId, name, email, verified) => await User.findOrCreate(
        {
            where: { googleId, isBlocked: false },
            raw: true,
            defaults: { googleId, name, email, verified }
        }
    )
}

export default repository;