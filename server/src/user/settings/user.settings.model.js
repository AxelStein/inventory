import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';
import {appConfig} from "../../app/app.config.js";
import User from "../user.model.js";

class UserSettings extends Model {}

UserSettings.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    theme: {
        type: DataTypes.ENUM(...appConfig.themes),
        defaultValue: appConfig.themes[0],
        allowNull: false,
    },
    locale: {
        type: DataTypes.ENUM(...appConfig.languages.map(l => l.locale)),
        allowNull: false,
        defaultValue: appConfig.languages.find(l => l.default).locale,
    },
}, {
    sequelize: db,
    modelName: "UserSettings",
    tableName: "user_settings",
    defaultScope: {
        attributes: {
            exclude: [
                'id',
                'userId',
                'createdAt',
                'updatedAt',
            ]
        }
    }
});

User.hasOne(UserSettings, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
    as: 'settings'
});

UserSettings.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    as: 'user'
});

export default UserSettings;