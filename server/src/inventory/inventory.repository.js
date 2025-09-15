import Inventory from './inventory.model.js';
import InventoryListFilter from './inventory.list.filters.js';
import { mapInventory, mapInventoryList } from './inventory.mapper.js';
import { Op, Sequelize } from "sequelize";
import { createSortOrder } from "../db/sort.order.js";
import { getInventoryPermissions, getInventoryAccessRole } from '../middleware/check.access.js';
import db from '../db/index.js';

const createListInclude = () => {
    return [
        { association: 'owner' },
        { association: 'category' },
    ];
};

const createItemCountAttribute = () => {
    return [
        Sequelize.literal(`(
            SELECT CAST(COUNT(*) AS INTEGER) 
            FROM inventory_items AS "item"
            WHERE "item"."inventoryId" = "Inventory"."id"
        )`),
        'itemCount'
    ];
}

const getInventoryList = async (page, perPage, options) => {
    options.attributes = {
        include: [createItemCountAttribute()]
    };
    const data = await Inventory.getPage(page, perPage, options);
    data.items = mapInventoryList(data.items);
    return data;
}

const queryAggValues = async (inventoryId) => {
    const result = await db.query(`
        SELECT 
            GREATEST(max1, max2, max3) as max_overall, 
            LEAST(min1, min2, min3) as min_overall, (COALESCE(avg1,0) + COALESCE(avg2, 0) + COALESCE(avg3,0)) 
                /
                NULLIF(
                    (CASE WHEN avg1 IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN avg2 IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN avg3 IS NOT NULL THEN 1 ELSE 0 END), 0
                )
            AS avg_overall
        FROM (
        SELECT 
            MAX("customInt1") as max1,
            MAX("customInt2") as max2,
            MAX("customInt3") as max3,
            MIN("customInt1") as min1,
            MIN("customInt2") as min2,
            MIN("customInt3") as min3,
            AVG("customInt1") as avg1,
            AVG("customInt2") as avg2,
            AVG("customInt3") as avg3
        FROM inventory_items WHERE "inventoryId" = ${inventoryId}
    )`, { type: Sequelize.QueryTypes.SELECT });
    return result[0];
}

const queryPopularValues = async (inventoryId) => {
    const result = await db.query(`
        SELECT word, COUNT(*) AS frequency
        FROM (
            SELECT unnest(tsvector_to_array("searchVector")) AS word
            FROM inventory_items
            WHERE "inventoryId" = ${inventoryId}
        ) AS words
        GROUP BY word
        ORDER BY frequency DESC
        LIMIT 5;
    `);
    return result[0]?.map(value => value.word);
}

const repository = {

    getByIdWithWriteAccess: (id) => Inventory.findOne({
        where: { id },
        include: [
            { association: 'writeAccess' },
            { association: 'owner' },
        ]
    }),

    getById: async ({ reqUser, id, transaction, lock }) => {
        const inventory = await Inventory.findOne({
            where: { id },
            include: [
                { association: 'owner' },
                { association: 'category' },
                { association: 'writeAccess' },
                { association: 'tags', through: { attributes: [] } }

            ],
            attributes: {
                include: [createItemCountAttribute()]
            },
            transaction,
            lock
        });
        inventory.permissions = getInventoryPermissions(getInventoryAccessRole(reqUser, inventory));
        return mapInventory(inventory);
    },

    search: async ({ q, page, perPage, sortBy, sortAsc }) => {
        return getInventoryList(page, perPage, {
            where: Sequelize.literal(`to_tsquery('english', :query) @@ "Inventory"."searchVector"`),
            include: createListInclude(),
            order: createSortOrder(sortBy, sortAsc),
            replacements: { query: `${q}:*` },
        });
    },

    getListByTag: async ({ tagId, page, perPage, sortBy, sortAsc }) => {
        return getInventoryList(page, perPage, {
            where: {
                id: {
                    [Op.in]: Sequelize.literal(`(
                        SELECT "inventory_tags_embedded"."inventoryId" 
                        FROM inventory_tags_embedded 
                        WHERE "tagId" = :tagId
                    )`)
                }
            },
            order: createSortOrder(sortBy, sortAsc),
            include: createListInclude(),
            replacements: { tagId },
        });
    },

    getList: async ({ userId, filter, page, perPage, sortBy, sortAsc }) => {
        const where = {};
        const include = createListInclude();

        if (userId) {
            switch (filter) {
                case InventoryListFilter.OWN:
                    where.ownerId = userId;
                    break;

                case InventoryListFilter.WRITE_ACCESS:
                    include.push({
                        association: 'writeAccess',
                        where: { userId },
                        required: true
                    });
                    break;
            }
        }

        return getInventoryList(page, perPage, {
            where,
            order: createSortOrder(sortBy, sortAsc),
            include
        });
    },

    create: async ({ reqUser, data }) => {
        const inventory = await Inventory.create({ ...data, ownerId: reqUser.id });
        return repository.getById({ reqUser, id: inventory.id });
    },

    createOdooToken: async ({ reqUser, id, odooToken, version }) => {
        await Inventory.optimisticLockUpdate(id, { version, odooToken });
        return repository.getById({ reqUser, id });
    },

    getByOdooToken: async ({ odooToken }) => {
        const inventory = mapInventory(
            await Inventory.findOne({
                where: { odooToken },
            })
        );
        inventory.aggValues = await queryAggValues(inventory.id);
        inventory.popularValues = await queryPopularValues(inventory.id);
        return inventory;
    },

    update: async ({ reqUser, id, data }) => {
        await Inventory.optimisticLockUpdate(id, data);
        return repository.getById({ reqUser, id });
    },

    delete: (id) => Inventory.destroy({ where: { id } }),

    deleteImage: async ({ reqUser, id, version }) => {
        await Inventory.optimisticLockUpdate(id, { imageLink: null, version });
        return repository.getById({ reqUser, id });
    }
}

export default repository;