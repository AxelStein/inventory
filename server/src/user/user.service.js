import repository from "./user.repository.js";
import User from "./user.model.js";

const service = {
    
    getNotBlocked: async (id) => {
        const user = await repository.getNotBlocked(id);
        if (user) {
            await repository.updateLastSeenDate(user.id);
        }
        return user;
    },

    getByEmail: (email, transaction) => repository.getByEmail(email, transaction),

    updateUserPassword: (userId, password, transaction = null) => repository.updateUserPassword(userId, password, transaction),

    create: (name, email, password) => repository.create(name, email, password),

    getOrCreateWithGoogle: (googleId, name, email, verified) => repository.getOrCreateWithGoogle(googleId, name, email, verified),
}

export default service;