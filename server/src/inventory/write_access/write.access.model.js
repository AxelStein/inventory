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
WriteAccess.belongsTo(WriteAccess, {
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