import {DataTypes, Sequelize} from 'sequelize';
import db from '../db/index.js';
import User from '../user/user.model.js';
import Category from './category/category.model.js';
import Tag from './tag/tag.model.js';
import {CustomFieldState, inflateInventoryCustomFields} from './inventory.custom.field.js';
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
        type: DataTypes.TEXT,
    },
    imageLink: {
        type: DataTypes.STRING,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    searchVector: {
        type: DataTypes.TSVECTOR,
    },
    odooToken: {
        type: DataTypes.STRING,
        unique: true
    }
};

inflateInventoryCustomFields((prefix) => {
    columns[`${prefix}Name`] = {
        type: DataTypes.STRING,
    };
    columns[`${prefix}Description`] = {
        type: DataTypes.STRING,
    };
    columns[`${prefix}State`] = {
        type: DataTypes.ENUM(...Object.values(CustomFieldState)),
    };
});

const updateSearchVector = (item) => {
    const values = [item.title, item.description];
    item.searchVector = Sequelize.fn(
        'to_tsvector',
        'english',
        values.join(' ')
    )
}

Inventory.init(columns, {
    sequelize: db,
    modelName: "Inventory",
    tableName: "inventories",
    version: true,
    indexes: [
        {
            fields: ['searchVector'],
            using: 'gin'
        }
    ],
    hooks: {
        beforeCreate: (item) => updateSearchVector(item),
        beforeUpdate: (item) => updateSearchVector(item)
    },
    defaultScope: {
        attributes: {
            exclude: [
                'searchVector'
            ]
        }
    }
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
    foreignKey: {
        name: 'tagId',
        allowNull: false
    },
    otherKey: {
        name: 'inventoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'inventories'
});
Inventory.belongsToMany(Tag, {
    through: 'inventory_tags_embedded',
    foreignKey: {
        name: 'inventoryId',
        allowNull: false
    },
    otherKey: {
        name: 'tagId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'tags'
});

export default Inventory;