import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';
import Inventory from '../inventory.model.js';
import CustomIdType from './custom.id.type.js';
import {trimString} from "../../util/string.util.js";
import {format} from "date-fns";
import {generateRandomNumberForCustomId} from "./custom.id.random.number.generator.js";
import crypto from "crypto";
import {formatCustomId} from "./custom.id.formatter.js";

class CustomId extends Model {

    toString() {
        return formatCustomId(this);
    }
}

CustomId.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM(...Object.values(CustomIdType)),
        allowNull: false,
    },
    rule: {
        type: DataTypes.STRING,
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
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'customId'
});
CustomId.belongsTo(Inventory, {
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    as: 'inventory'
});

export default CustomId;