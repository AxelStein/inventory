import repository from "./user.repository.js";

const service = {
    
    getNotBlocked: async (id) => {
        const user = await repository.getNotBlocked(id);
        if (user) {
            await repository.updateLastSeenDate(user.id);
        }
        return user;
    },

    getByEmail: (email) => repository.getByEmail(email),

    create: (name, email, password) => repository.create(name, email, password),

    getOrCreateWithGoogle: (googleId, name, email, verified) => repository.getOrCreateWithGoogle(googleId, name, email, verified),
}

export default service;