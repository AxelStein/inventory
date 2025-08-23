import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';
import User from '../../user/user.model.js';
import Inventory from '../inventory.model.js';
import {PagingModel} from "../../db/paging.model.js";

class Post extends PagingModel {}

Post.init({
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
    modelName: "InventoryPost",
    tableName: "inventory_posts"
});

User.hasMany(Post, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'inventoryPosts'
});
Post.belongsTo(User, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    },
    as: 'author'
});

Inventory.hasMany(Post, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'posts'
});
Post.belongsTo(Inventory, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'inventory'
});

export default Post;