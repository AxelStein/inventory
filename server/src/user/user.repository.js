import User from './user.model.js';

const repository = {

    getNotBlocked: (id) => User.findOne({ where: { id, isBlocked: false }, raw: true }),

    updateLastSeenDate: (id) => User.update({ lastSeen: new Date() }, { where: { id } }),

    getByEmail: (email, transaction = null) => User.findOne({
        attributes: { include: ['password'] },
        where: { email },
        raw: true,
        transaction
    }),

    create: (name, email, password) => User.create({ name, email, password }, { raw: true })
}

export default repository;