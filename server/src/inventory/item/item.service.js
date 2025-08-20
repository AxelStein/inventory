import repository from './item.repository.js';
import db from '../../db/index.js';
import { generateCustomId } from '../custom_id/custom.id.generator.js';

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (inventoryId, sortBy, sortAsc, page, perPage, q) => repository.getList(inventoryId, sortBy, sortAsc, page, perPage, q),

    create: (creatorId, data) => db.transaction(async (transaction) => {
        if (!data.customId) {
            data.customId = await generateCustomId({ inventoryId: data.inventoryId, transaction });
        }
        return repository.create(creatorId, data, transaction);
    }),

    update: (id, data) => repository.update(id, data),

    delete: (id) => repository.delete(id)
}

export default service;