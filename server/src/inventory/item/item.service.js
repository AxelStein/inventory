import repository from './item.repository.js';
import customIdRepository from '../custom_id/custom.id.repository.js';
import db from '../../db/index.js';
import { Transaction } from 'sequelize';
import { generateCustomId } from '../custom_id/custom.id.generator.js';
import CustomIdType from '../custom_id/custom.id.type.js';

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (inventoryId, sortBy, sortAsc, page, perPage) => repository.getList(inventoryId, sortBy, sortAsc, page, perPage),

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