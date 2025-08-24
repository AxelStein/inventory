import Inventory from './inventory.model.js';
import InventoryListFilter from './inventory.list.filters.js';
import {mapInventory, mapInventoryList} from './inventory.mapper.js';
import {Op, Sequelize} from "sequelize";
import {createSortOrder} from "../db/sort.order.js";

const createListInclude = () => {
    return [
        {association: 'owner'},
        {association: 'category'},
    ];
};

const getInventoryList = async (page, perPage, options) => {
    const data = await Inventory.getPage(page, perPage, options);
    data.items = mapInventoryList(data.items);
    return data;
}

const repository = {

    getByIdWithWriteAccess: (id) => Inventory.findOne({
        where: {id},
        include: [
            {association: 'writeAccess'},
            {association: 'owner'},
        ]
    }),

    getById: async (id, transaction, lock) => mapInventory(await Inventory.findOne({
        where: {id},
        include: [
            {association: 'owner'},
            {association: 'category'},
        ],
        transaction,
        lock
    })),

    search: async ({q, page, perPage, sortBy, sortAsc}) => {
        return getInventoryList(page, perPage, {
            where: Sequelize.literal(`to_tsquery('english', :query) @@ "Inventory"."searchVector"`),
            include: createListInclude(),
            order: createSortOrder(sortBy, sortAsc),
            replacements: {query: `${q}:*`},
        });
    },

    getListByTag: async ({tagId, page, perPage, sortBy, sortAsc}) => {
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
            replacements: {tagId},
        });
    },

    getList: async ({userId, filter, page, perPage, sortBy, sortAsc}) => {
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
                        where: {userId},
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

    create: async (ownerId, data) => mapInventory(await Inventory.create({...data, ownerId}, {returning: true})),

    update: async (id, data) => mapInventory(await Inventory.optimisticLockUpdate(id, data)),

    delete: (id) => Inventory.destroy({where: {id}}),
}

export default repository;