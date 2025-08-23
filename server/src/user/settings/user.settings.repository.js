import UserSettings from "./user.settings.model.js";
import {NotFoundError} from "../../error/index.js";

const repository = {

    createDefault: (userId, transaction = null) => UserSettings.create(
        { userId },
        { transaction }
    ),

    save: async (userId, data) => {
        const [count, rows] = await UserSettings.update(
            data,
            { where: { userId }, returning: true }
        );
        if (count === 0) {
            throw new NotFoundError('User settings not found');
        }
        return rows[0];
    },
}

export default repository;