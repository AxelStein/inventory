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
}

export default repository;