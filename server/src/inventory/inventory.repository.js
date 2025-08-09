import Inventory from './inventory.model.js';

const repository = {

    getByIdWithWriteAccess: (id) => Inventory.findOne({ where: { id }, include: 'writeAccess' })
}

export default repository;