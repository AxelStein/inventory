import CustomId from './custom.id.model.js';
import db from '../../db/index.js';
import {Transaction} from "sequelize";
import {ConflictError, NotFoundError, ValidationError} from "../../error/index.js";

const reorderIds = async (inventoryId, transaction) => {
    const ids = await repository.getList(inventoryId, transaction, Transaction.LOCK.UPDATE);
    for (let i = 0; i < ids.length; i++) {
        ids[i].position = i;
        await ids[i].save({ transaction });
    }
    return ids;
}

const repository = {

    getByIdWithInventory: (id) => CustomId.findOne({
        where: { id },
        include: {
            association: 'inventory',
            include: [{
                association: 'writeAccess'
            }]
        }
    }),

    getList: (inventoryId, transaction, lock) => CustomId.findAll({ 
        where: { inventoryId }, 
        order: [['position', 'ASC']], 
        transaction, 
        lock 
    }),

    create: (data) => db.transaction(async (transaction) => {
        const ids = await repository.getList(data.inventoryId, transaction, Transaction.LOCK.UPDATE);
        data.position = ids.length;
        return await CustomId.create(data, { returning: true, transaction });
    }),

    update: (id, data) => db.transaction(async (transaction) => {
        const item = await CustomId.update(
            data,
            { where: id, transaction, returning: true }
        );
        await reorderIds(item.inventoryId, transaction);
    }),

    delete: (id) => db.transaction(async (transaction) => {
        const customId = await CustomId.findOne({
            where: { id },
            transaction,
            lock: Transaction.LOCK.UPDATE
        });
        if (!customId) throw new NotFoundError('Custom id not found');

        const inventoryId = customId.inventoryId;
        await customId.destroy({ transaction });
        await reorderIds(inventoryId, transaction);
    }),

    reorder: (inventoryId, positions) => db.transaction(async (transaction) => {
        const ids = await repository.getList(inventoryId, transaction, Transaction.LOCK.UPDATE);
        if (ids.length !== positions.length) throw new ConflictError('Invalid positions');

        for (let i = 0; i < ids.length; i++) {
            const item = ids[i];

            const position = positions.indexOf(item.id);
            if (position === -1) throw new ConflictError('Invalid positions');

            item.position = position;
            await item.save({ transaction });
        }
        return ids.sort((a, b) => a.position - b.position);
    })
}

export default repository;