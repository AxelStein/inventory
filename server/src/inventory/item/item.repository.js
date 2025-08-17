import { Sequelize } from 'sequelize';
import Item from './item.model.js';
import ItemLike from './like/item.like.model.js';

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
        return Item.findAll({ 
            attributes: {
                include: [
                    [
                        Sequelize.cast(Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'INTEGER'), 
                        'likeCount'
                    ]
                ]
            },
            include: [{
                association: 'likes',
                attributes: []
            }],
            group: ['InventoryItem.id'],
            where: { inventoryId }, 
            order 
        });
    },

    create: (creatorId, data) => Item.create({ ...data, creatorId }, { returning: true }),

    update: async (id, data) => Item.optimisticLockUpdate(id, data),

    delete: (id) => Item.destroy({ where: { id } })
}

export default repository;