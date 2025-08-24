import {DataTypes, Model, Sequelize} from 'sequelize';
import db from '../db/index.js';
import UserRole from './user.role.js';
import {PagingModel} from "../db/paging.model.js";

class User extends PagingModel {}

const updateSearchVector = (item) => {
    const values = [item.name, item.email];
    item.searchVector = Sequelize.fn(
        'to_tsvector',
        'english',
        values.join(' ')
    )
}

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
        },
        searchVector: {
            type: DataTypes.TSVECTOR,
        }
    }, {
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
        },
        indexes: [
            {
                fields: ['searchVector'],
                using: 'gin'
            }
        ],
        hooks: {
            beforeCreate: (item) => updateSearchVector(item)
        },
    }
);

export default User;