import { DataTypes, Model } from 'sequelize';
import db from '../../../db/index.js';
import Item from '../item.model.js';
import User from '../../../user/user.model.js';

class ItemLike extends Model { }

ItemLike.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itemId: {
        type: DataTypes.INTEGER,
        unique: 'user_item_unique_like',
    },
    userId: {
        type: DataTypes.INTEGER,
        unique: 'user_item_unique_like',
    }
}, {
    sequelize: db,
    modelName: "ItemLike",
    tableName: "inventory_item_likes"
});

Item.hasMany(ItemLike, {
    foreignKey: {
        name: 'itemId',
        allowNull: false,
    },
    onDelete: "CASCADE",
    as: 'likes'
});
ItemLike.belongsTo(Item, {
    foreignKey: {
        name: 'itemId',
        allowNull: false
    },
    as: 'item',
});

User.hasMany(ItemLike, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: "CASCADE",
    as: 'itemLikes'
});
ItemLike.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    as: 'user'
});

export default ItemLike;