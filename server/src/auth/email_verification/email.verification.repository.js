import EmailVerification from "./email.verification.model.js";

const repository = {

    delete: (userId, transaction = null) => EmailVerification.destroy({ where: { userId }, transaction }),

    create: (data, transaction = null) => EmailVerification.create(data, { transaction }),

    get: (userId, code, transaction = null, lock = null) => EmailVerification.findOne({
        where: { userId, code },
        transaction,
        lock
    })
}

export default repository;