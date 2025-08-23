import Inventory from './inventory.model.js';
import InventoryListFilter from './inventory.list.filters.js';
import { mapInventory, mapInventoryList } from './inventory.mapper.js';

const repository = {

    getByIdWithWriteAccess: (id) => Inventory.findOne({
        where: { id },
        include: [
            { association: 'writeAccess' },
            { association: 'owner' },
        ]
    }),

    getById: async (id, transaction, lock) => mapInventory(await Inventory.findOne({
        where: { id },
        include: [
            { association: 'owner' },
            { association: 'category' },
        ],
        transaction,
        lock
    })),

    getList: async (userId, filter, sortBy, sortAsc, page, perPage) => {
        const where = {};
        let include = [
            { association: 'owner' },
            { association: 'category' },
        ];
        const order = sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : undefined;
        
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
        const data = await Inventory.getPage(page, perPage,{
            where,
            order,
            include
        });
        data.items = mapInventoryList(data.items);
        return data;
    },

    create: async (ownerId, data) => mapInventory(await Inventory.create({ ...data, ownerId }, { returning: true })),

    update: async (id, data) => mapInventory(await Inventory.optimisticLockUpdate(id, data)),

    delete: (id) => Inventory.destroy({ where: { id } }),
}

export default repository;