import { col, DataTypes } from 'sequelize';
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
        unique: true,
    },
    values: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
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
    foreignKey: 'inventoryId',
    onDelete: 'CASCADE',
    as: 'items'
});
Item.belongsTo(Inventory, {
    foreignKey: 'inventoryId',
    as: 'inventory'
});

User.hasMany(Item, {
    foreignKey: 'creatorId',
    onDelete: 'CASCADE',
    as: 'inventoryItems'
});
Item.belongsTo(User, {
    foreignKey: 'creatorId',
    as: 'creator'
});

export default Item;