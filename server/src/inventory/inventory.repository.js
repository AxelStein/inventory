import Inventory from './inventory.model.js';

const repository = {

    getInventoryWithWriteAccess: (id) => Inventory.findOne({ where: { id }, include: 'writeAccess' })
}

export default repository;