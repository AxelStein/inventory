import repository from "./tag.repository.js";

const service = {

    getFromInventory: (inventoryId) => repository.getFromInventory(inventoryId),

    getList: () => repository.getList(),

    create: (inventoryId, name) => repository.create(inventoryId, name),

    delete: (id, inventoryId) => repository.delete(id, inventoryId),
}

export default service;