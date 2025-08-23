import { DataTypes, Model } from 'sequelize';
import db from '../db/index.js';
import UserRole from './user.role.js';
import {PagingModel} from "../db/paging.model.js";

class User extends PagingModel { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    facebookId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER,
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    lastSeen: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},
    {
        sequelize: db,
        modelName: "User",
        tableName: "users",
        defaultScope: {
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt',
                    'password',
                    'googleId',
                    'facebookId',
                ]
            }
        }
    }
);

export default User;