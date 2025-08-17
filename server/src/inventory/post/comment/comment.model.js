import { DataTypes, Model } from 'sequelize';
import db from '../../../db/index.js';
import Post from '../post.model.js';
import User from '../../../user/user.model.js';

class Comment extends Model { }

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName: 'InventoryPostComment',
    tableName: 'inventory_post_comments'
});

Post.hasMany(Comment, {
    foreignKey: {
        name: 'postId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'comments'
});
Comment.belongsTo(Post, {
    foreignKey: {
        name: 'postId',
        allowNull: false
    },
    as: 'post'
});

User.hasMany(Comment, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'inventoryPostComments'
});
Comment.belongsTo(User, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    },
    as: 'author'
});

export default Comment;