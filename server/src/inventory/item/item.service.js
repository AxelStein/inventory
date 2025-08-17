import repository from './item.repository.js';

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (inventoryId, sortBy, sortAsc, page, perPage) => repository.getList(inventoryId, sortBy, sortAsc, page, perPage),

    create: (creatorId, data) => repository.create(creatorId, data),

    update: (id, data) => repository.update(id, data),

    delete: (id) => repository.delete(id)
}

export default service;