import { literal } from 'sequelize';
import Inventory from './inventory.model.js';
import { ConfictError } from '../error/index.js';
import InventoryListFilter from './inventory.list.filters.js';

const repository = {

    getByIdWithWriteAccess: (id) => Inventory.findOne({ where: { id }, include: 'writeAccess' }),

    getById: (id, transaction, lock) => Inventory.findOne({ where: { id }, transaction, lock }),

    getList: (userId, filter, sortBy, sortAsc) => {
        const where = {};
        let include = null;
        switch (filter) {
            case InventoryListFilter.OWN:
                where.ownerId = userId;
                break;
            case InventoryListFilter.WRITE_ACCESS:
                include = {
                    association: 'writeAccess',
                    where: { userId },
                    required: true
                };
                break;
        }
        return Inventory.findAll({ where, order: [[sortBy, sortAsc ? 'ASC' : 'DESC']], include });
    },

    create: (ownerId, data) => Inventory.create({ ...data, ownerId }),

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
        return inventory;
    },

    delete: (id) => Inventory.destroy({ where: { id } }),
}

export default repository;