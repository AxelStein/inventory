import { DataTypes, Model } from 'sequelize';
import db from '../db/index.js';
import User from '../user/user.model.js';
import Category from './category/category.model.js';
import Tag from './tag/tag.model.js';

class Inventory extends Model {}

Inventory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    imageLink: {
        type: DataTypes.STRING,
    },
    customFields: {
        type: DataTypes.JSONB
    }
}, {
    sequelize: db,
    modelName: "Inventory",
    tableName: "inventories",
    version: true
});

User.hasMany(Inventory, {
    foreignKey: 'ownerId',
    onDelete: 'CASCADE',
    as: 'inventories'
});
Inventory.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner'
});

Category.hasMany(Inventory, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
    as: 'inventories'
});
Inventory.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

Tag.hasMany(Inventory, {
    foreignKey: "inventoryId",
    onDelete: 'CASCADE',
    as: 'inventories'
});
Inventory.hasMany(Tag, {
    foreignKey: 'tagId',
    as: 'tags'
});

export default Inventory;