import { DataTypes } from 'sequelize';
import db from '../db/index.js';
import User from '../user/user.model.js';
import Category from './category/category.model.js';
import Tag from './tag/tag.model.js';
import { CustomFieldState, inflateInventoryCustomFields } from './inventory.custom.field.js';
import { OptimisticLockModel } from '../db/optimistic.lock.model.js';

class Inventory extends OptimisticLockModel { }

const columns = {
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
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
};

inflateInventoryCustomFields((prefix) => {
    columns[`${prefix}Name`] = {
        type: DataTypes.STRING,
    };
    columns[`${prefix}Description`] = {
        type: DataTypes.STRING,
    };
    columns[`${prefix}State`] = {
        type: DataTypes.ENUM(...CustomFieldState.values()),
    };
});

Inventory.init(columns, {
    sequelize: db,
    modelName: "Inventory",
    tableName: "inventories",
    version: true
});

User.hasMany(Inventory, {
    foreignKey: {
        name: 'ownerId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
    as: 'inventories'
});
Inventory.belongsTo(User, {
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    as: 'owner'
});

Category.hasMany(Inventory, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'inventories'
});
Inventory.belongsTo(Category, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    },
    as: 'category'
});

Tag.belongsToMany(Inventory, {
    through: 'inventory_tags_embedded',
    foreignKey: 'tagId',
    otherKey: 'inventoryId',
    onDelete: 'CASCADE',
    as: 'inventories'
});
Inventory.belongsToMany(Tag, {
    through: 'inventory_tags_embedded',
    foreignKey: 'inventoryId',
    otherKey: 'tagId',
    onDelete: 'CASCADE',
    as: 'tags'
});

export default Inventory;