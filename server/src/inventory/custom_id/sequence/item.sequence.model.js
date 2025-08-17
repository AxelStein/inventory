import { DataTypes, Model } from 'sequelize';
import db from '../../../db/index.js';
import Inventory from '../../inventory.model.js';

class ItemSequence extends Model { }

ItemSequence.init({
    inventoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    sequelize: db,
    modelName: "ItemSequence",
    tableName: "item_sequences",
    timestamps: false,
});

Inventory.hasOne(ItemSequence, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'itemSequence'
});
ItemSequence.belongsTo(Inventory, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    as: 'inventory'
});

export default ItemSequence;