import { DataTypes, Model } from 'sequelize';
import db from '../db/index.js';

class Category extends Model {}

Category.init({
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
    modelName: "InventoryCategory",
    tableName: "inventory_categories"
});

export default Category;
