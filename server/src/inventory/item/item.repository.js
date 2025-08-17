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

    getList: async (inventoryId, sortBy, sortAsc, page, perPage) => {
        const { count, rows } = await Item.findAndCountAll({
            include: [{
                association: 'likes',
                include: [{
                    association: 'user'
                }],
                attributes: ['createdAt']
            }],
            where: { inventoryId },
            order: sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : undefined,
            limit: perPage,
            offset: (page - 1) * perPage,
        });
        return { totalCount: count, hasMore: page * perPage < count, items: rows };
    },

    create: (creatorId, data) => Item.create({ ...data, creatorId }, { returning: true }),

    update: async (id, data) => Item.optimisticLockUpdate(id, data),

    delete: (id) => Item.destroy({ where: { id } })
}

export default repository;