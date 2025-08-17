import { literal } from 'sequelize';
import Inventory from './inventory.model.js';
import { ConfictError } from '../error/index.js';
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

    getList: async (userId, filter, sortBy, sortAsc) => {
        const where = {};
        let include = [
            { association: 'owner' },
            { association: 'category' },
        ];
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
        return mapInventoryList(await Inventory.findAll({
            where,
            order: [[sortBy, sortAsc ? 'ASC' : 'DESC']],
            include
        }));
    },

    create: async (ownerId, data) => mapInventory(await Inventory.create({ ...data, ownerId }, { returning: true })),

    update: async (id, data) => {
        const [rows, inventory] = await Inventory.update({
            ...data,
            version: literal('version + 1'),
        }, {
            where: {
                id,
                version: data.version,
            },
            returning: true,
        });
        if (rows === 0) {
            throw new ConfictError();
        }
        return mapInventory(inventory[0]);
    },

    delete: (id) => Inventory.destroy({ where: { id } }),
}

export default repository;