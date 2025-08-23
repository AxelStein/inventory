import UserSettings from "./user.settings.model.js";

const repository = {

    createDefault: (userId, transaction = null) => UserSettings.create(
        { userId },
        { transaction }
    ),

    save: async (userId, data) => {
        await UserSettings.update(
            data,
            { where: { userId } }
        )
        return repository.getForUser(userId);
    },

    getForUser: (userId) => UserSettings.findOne({ where: { userId } }),
}

export default repository;