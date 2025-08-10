import CustomId from './custom.id.model.js';

const repository = {

    getByIdWithInventory: (id) => CustomId.findOne({
        where: { id },
        include: {
            association: 'inventory',
            include: [{
                association: 'writeAccess'
            }]
        }
    })
}

export default repository;