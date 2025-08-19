import WriteAccess from './write.access.model.js';

const repository = {

    getByIdWithInventory: (id) => WriteAccess.findOne({ 
        where: { id },
        include: [{
            association: 'inventory'
        }]
    }),

    getList: (inventoryId) => WriteAccess.findAll({
        where: { inventoryId },
        include: [{ association: 'user' }],
        attributes: {
            exclude: ['inventoryId', 'userId']
        }
    }),

    create: (inventoryId, userId) => WriteAccess.create({ inventoryId, userId}),

    delete: (id) => WriteAccess.destroy({ where: { id } })
}

export default repository;