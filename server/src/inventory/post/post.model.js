import { DataTypes, Model } from 'sequelize';
import db from '../db/index.js';
import User from '../../user/user.model.js';

class Post extends Model {}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName: "InventoryPost",
    tableName: "inventory_posts"
});

User.hasMany(Post, {
    foreignKey: 'authorId',
    onDelete: 'CASCADE',
    as: 'inventoryPosts'
});
Post.belongsTo(Post, {
    foreignKey: 'authorId',
    as: 'author'
});

export default Post;