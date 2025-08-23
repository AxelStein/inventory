import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';
import User from '../../user/user.model.js';

class PasswordReset extends Model {}

PasswordReset.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: db,
        modelName: "PasswordReset",
        tableName: "password_resets"
    }
);

User.hasOne(PasswordReset, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE'
});
PasswordReset.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
});

export default PasswordReset;