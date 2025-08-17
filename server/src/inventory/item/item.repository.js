import Item from './item.model.js';

const repository = {

    getByIdWithInventory: (id) => Item.findOne({
        where: { id },
        include: {
            association: 'inventory',
            include: [{
                association: 'writeAccess'
            }]
        }
    }),

    getList: (inventoryId, sortBy, sortAsc) => {
        const order = sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : undefined;
        return Item.findAll({ where: { inventoryId }, order });
    },

    create: (creatorId, data) => Item.create({ ...data, creatorId }, { returning: true }),

    update: async (id, data) => Item.optimisticLockUpdate(id, data),

    delete: (id) => Item.destroy({ where: { id } })
}

export default repository;