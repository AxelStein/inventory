import { DataTypes } from 'sequelize';
import db from '../../db/index.js';
import Inventory from '../inventory.model.js';
import User from '../../user/user.model.js';
import { inflateInventoryCustomFields } from '../inventory.custom.field.js';
import { OptimisticLockModel } from '../../db/optimistic.lock.model.js';

class Item extends OptimisticLockModel { }

const columns = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'item_unique_custom_id',
    },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'item_unique_custom_id',
    }
}

inflateInventoryCustomFields((prefix, field) => {
    columns[prefix] = { type: field.dbType };
});

Item.init(columns, {
    sequelize: db,
    modelName: "InventoryItem",
    tableName: "inventory_items",
    version: true
});

Inventory.hasMany(Item, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'items'
});
Item.belongsTo(Inventory, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    as: 'inventory'
});

User.hasMany(Item, {
    foreignKey: {
        name: 'creatorId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'inventoryItems'
});
Item.belongsTo(User, {
    foreignKey: {
        name: 'creatorId',
        allowNull: false
    },
    as: 'creator'
});

export default Item;