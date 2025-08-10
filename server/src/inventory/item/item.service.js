import repository from './item.repository.js';

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),
}

export default service;