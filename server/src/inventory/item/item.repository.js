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

    create: (creatorId, data) => Item.create({ ...data, creatorId }, { returning: true }),

    update: async (id, data) => Item.optimisticLockUpdate(id, data)
}

export default repository;