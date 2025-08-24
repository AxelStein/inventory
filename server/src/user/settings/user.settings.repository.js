import UserSettings from "./user.settings.model.js";

const repository = {

    createDefault: (userId, locale, transaction = null) => UserSettings.create(
        { userId, locale },
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