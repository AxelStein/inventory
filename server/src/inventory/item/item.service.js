import repository from './item.repository.js';
import db from '../../db/index.js';
import { generateCustomId } from '../custom_id/custom.id.generator.js';
import inventoryService from './../inventory.service.js';
import { ConflictError } from '../../error/index.js';

const checkInventoryVersion = async (data, transaction) => {
    const inventory = await inventoryService.getById({ id: data.inventoryId, transaction });
    if (inventory.version !== data.inventoryVersion) {
        throw new ConflictError();
    }
}

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (inventoryId, sortBy, sortAsc, page, perPage, q) => repository.getList(inventoryId, sortBy, sortAsc, page, perPage, q),

    create: (creatorId, data) => db.transaction(async (transaction) => {
        await checkInventoryVersion(data, transaction);

        if (!data.customId || data.customId.length === 0) {
            data.customId = await generateCustomId({ inventoryId: data.inventoryId, transaction });
        }
        return repository.create(creatorId, data, transaction);
    }),

    update: (id, data) => db.transaction(async (transaction) => {
        await checkInventoryVersion(data, transaction);
        return repository.update(id, data, transaction);
    }),

    delete: (id) => repository.delete(id)
}

export default service;