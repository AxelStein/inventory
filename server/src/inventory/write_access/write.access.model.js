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
    tableName: 'inventory_write_access',
});

Inventory.hasMany(WriteAccess, {
    foreignKey: 'inventoryId',
    onDelete: 'CASCADE',
    as: 'writeAccess'
});
WriteAccess.belongsTo(WriteAccess, {
    foreignKey: 'inventoryId',
    as: 'inventory'
});

User.hasMany(WriteAccess, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'inventoryWriteAccess'
});
WriteAccess.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

export default WriteAccess;