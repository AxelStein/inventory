import User from './user.model.js';

const repository = {

    getVerified: (id) => User.findOne({
        where: { id, isBlocked: false, verified: true },
        raw: true
    }),

    getNotBlocked: (id, transaction = null) => User.findOne({
        where: { id, isBlocked: false },
        transaction,
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

    create: (name, email, password, transaction) => User.create(
        { name, email, password },
        { raw: true, transaction }
    ),

    getOrCreateWithGoogle: async (googleId, name, email) => {
        const [user] = await User.findOrCreate(
            {
                where: { googleId, isBlocked: false, verified: true },
                raw: true,
                defaults: { googleId, name, email, verified: true }
            }
        );
        return user;
    }
}

export default repository;