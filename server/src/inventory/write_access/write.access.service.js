import repository from "./write.access.repository.js";

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (inventoryId) => repository.getList(inventoryId),

    create: (inventoryId, userId) => repository.create(inventoryId, userId),

    delete: (id) => repository.delete(id),
}

export default service;