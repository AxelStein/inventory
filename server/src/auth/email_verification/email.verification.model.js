import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';
import User from '../../user/user.model.js';

class EmailVerification extends Model {}

EmailVerification.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    sequelize: db,
    modelName: "EmailVerification",
    tableName: "email_verifications"
});

User.hasOne(EmailVerification, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE'
});
EmailVerification.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    }
});

export default EmailVerification;