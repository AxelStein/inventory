import repository from './custom.id.repository.js';

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id)
}

export default service;