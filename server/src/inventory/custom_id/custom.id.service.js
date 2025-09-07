import { generateCustomId } from './custom.id.generator.js';
import repository from './custom.id.repository.js';

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (inventoryId, transaction, lock) => repository.getList(inventoryId, transaction, lock),

    create: (data) => repository.create(data),

    preview: async (inventoryId) => generateCustomId({ parts: await service.getList(inventoryId) }),

    update: (id, data) => repository.update(id, data),

    delete: (id) => repository.delete(id),

    reorder: (inventoryId, customIds) => repository.reorder(inventoryId, customIds),
}

export default service;