import WriteAccess from './write.access.model.js';

const repository = {

    getByIdWithInventory: (id) => WriteAccess.findOne({ 
        where: { id },
        include: [{
            association: 'inventory'
        }]
    }),
}

export default repository;