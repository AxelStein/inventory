import repository from "./user.repository.js";
import User from "./user.model.js";

const service = {
    
    getVerified: async (id) => {
        const user = await repository.getVerified(id);
        if (user) {
            await repository.updateLastSeenDate(user.id);
        }
        return user;
    },

    getNotBlocked: (id, transaction = null) => repository.getNotBlocked(id, transaction),

    getByEmail: (email, transaction = null) => repository.getByEmail(email, transaction),

    updateUserPassword: (userId, password, transaction = null) => repository.updateUserPassword(userId, password, transaction),

    create: (name, email, password, transaction = null) => repository.create(name, email, password, transaction),

    getOrCreateWithGoogle: (googleId, name, email) => repository.getOrCreateWithGoogle(googleId, name, email),

    getOrCreateWithFacebook: (facebookId, name, email) => repository.getOrCreateWithFacebook(facebookId, name, email),
}

export default service;