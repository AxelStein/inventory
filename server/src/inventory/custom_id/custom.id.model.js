import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';
import Inventory from '../inventory.model.js';
import CustomIdType from './custom.id.type.js';

class CustomId extends Model { }

CustomId.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM(...CustomIdType.values()),
        allowNull: false,
    },
    rule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: 'InventoryCustomId',
    tableName: 'inventory_custom_ids'
});

Inventory.hasMany(CustomId, {
    foreignKey: 'inventoryId',
    onDelete: 'CASCADE',
    as: 'customId'
});
CustomId.belongsTo(Inventory, {
    foreignKey: 'inventoryId',
    as: 'inventory'
});

export default CustomId;