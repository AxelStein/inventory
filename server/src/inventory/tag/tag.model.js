import { DataTypes, Model } from 'sequelize';
import db from '../../db/index.js';

class Tag extends Model {}

Tag.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "InventoryTag",
    tableName: 'inventory_tags'
});

export default Tag;