import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';
import User from '../../user/user.model.js';
import Inventory from '../inventory.model.js';

class WriteAccess extends Model { }

WriteAccess.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'inventory_unique_write_access',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'inventory_unique_write_access',
    }
}, {
    sequelize: db,
    modelName: 'InventoryWriteAccess',
    tableName: 'inventory_write_access'
});

Inventory.hasMany(WriteAccess, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'writeAccess'
});
WriteAccess.belongsTo(Inventory, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    as: 'inventory'
});

User.hasMany(WriteAccess, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'inventoryWriteAccess'
});
WriteAccess.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    as: 'user'
});

export default WriteAccess;