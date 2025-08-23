import User from './user.model.js';

const repository = {

    getVerified: (where, transaction = null, lock = null) => User.findOne({
        where: { ...where, isBlocked: false, verified: true },
        raw: true,
        transaction,
        lock
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

    create: (data, transaction) => User.create(data, { raw: true, transaction }),

}

export default repository;