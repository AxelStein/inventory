import repository from "./user.settings.repository.js";

const service = {

    createDefault: (userId, locale, transaction = null) => repository.createDefault(userId, locale, transaction),

    save: (userId, data) => repository.save(userId, data),

    getForUser: (userId) => repository.getForUser(userId)
}

export default service;