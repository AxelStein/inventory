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
                Sequelize.fn('to_tsquery', 'english', q),
                '@@',
                Sequelize.col('searchVector')
            );
        }
        const { count, rows } = await Item.findAndCountAll({
            include: [{
                association: 'likes',
                include: [{
                    association: 'user'
                }],
                attributes: ['createdAt']
            }],
            where,
            order: sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : undefined,
            limit: perPage,
            offset: (page - 1) * perPage,
        });
        return { totalCount: count, hasMore: page * perPage < count, items: rows };
    },

    create: async (creatorId, data, transaction) => Item.create(
        { ...data, creatorId },
        { returning: true, transaction }
    ),

    update: async (id, data) => Item.optimisticLockUpdate(id, data),

    delete: (id) => Item.destroy({ where: { id } })
}

export default repository;