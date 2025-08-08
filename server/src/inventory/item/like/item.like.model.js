import { DataTypes, Model } from 'sequelize';
import db from '../db/index.js';
import Item from '../item.model.js';
import User from '../../../user/user.model.js';

class ItemLike extends Model { }

ItemLike.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
}, {
    sequelize: db,
    modelName: "ItemLike",
    tableName: "inventory_item_likes"
});

Item.hasMany(ItemLike, {
    foreignKey: 'itemId',
    onDelete: "CASCADE",
    as: 'likes'
});
ItemLike.belongsTo(Item, {
    foreignKey: 'itemId',
    as: 'item'
});

User.hasMany(ItemLike, {
    foreignKey: 'userId',
    onDelete: "CASCADE",
    as: 'itemLikes'
});
ItemLike.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

export default ItemLike;