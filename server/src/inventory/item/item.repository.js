import Item from './item.model.js';
import {Sequelize, Op} from "sequelize";

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

    getList: async (inventoryId, sortBy, sortAsc, page, perPage, q) => {
        const where = { inventoryId };
        if (q) {
            where[Op.and] = Sequelize.where(
                Sequelize.fn('to_tsquery', 'english', `${q}:*`),
                '@@',
                Sequelize.col('searchVector')
            );
        }
        return Item.getPage(page, perPage, {
            include: [{
                association: 'likes',
                include: [{
                    association: 'user'
                }],
                attributes: ['createdAt']
            }],
            where,
            order: sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : undefined,
        });
    },

    create: async (creatorId, data, transaction) => Item.create(
        { ...data, creatorId },
        { returning: true, transaction }
    ),

    update: async (id, data) => Item.optimisticLockUpdate(id, data),

    delete: (id) => Item.destroy({ where: { id } })
}

export default repository;