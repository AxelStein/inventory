import { DataTypes, Model } from 'sequelize';
import db from '../../../db/index.js';
import Post from '../post.model.js';
import User from '../../../user/user.model.js';

class Comment extends Model {}

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
    foreignKey: 'postId',
    onDelete: 'CASCADE',
    as: 'comments'
});
Comment.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post'
});

User.hasMany(Comment, {
    foreignKey: 'authorId',
    onDelete: 'CASCADE',
    as: 'inventoryPostComments'
});
Comment.belongsTo(User, {
    foreignKey: 'authorId',
    as: 'author'
});

export default Comment;