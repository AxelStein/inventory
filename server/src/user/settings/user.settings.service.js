import repository from "./user.settings.repository.js";

const service = {

    createDefault: (userId, transaction = null) => repository.createDefault(userId, transaction),

    save: (userId, data) => repository.save(userId, data),
}

export default service;