import CustomId from './custom.id.model.js';
import db from '../../db/index.js';
import {Transaction} from "sequelize";
import {ConflictError, NotFoundError, ValidationError} from "../../error/index.js";

const reorderIds = async ({inventoryId, positions, transaction}) => {
    const ids = await repository.getList(inventoryId, transaction, Transaction.LOCK.UPDATE);
    for (let i = 0; i < ids.length; i++) {
        const item = ids[i];
        if (positions) {
            const position = positions.indexOf(item.id);
            if (position === -1) throw new ConflictError(__('customId.error.invalidPositions'));
            item.position = position;
        } else {
            item.position = i;
        }
        await ids[i].save({ transaction });
    }
    return ids.sort((a, b) => a.position - b.position);
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
        const [, rows] = await CustomId.update(
            data,
            { where: { id }, transaction, returning: true }
        );
        const item = rows[0];
        await reorderIds({ inventoryId: item.inventoryId, transaction });
        return item;
    }),

    delete: (id) => db.transaction(async (transaction) => {
        const customId = await CustomId.findOne({
            where: { id },
            transaction,
            lock: Transaction.LOCK.UPDATE
        });
        if (!customId) throw new NotFoundError(__('customId.error.notFound'));

        const inventoryId = customId.inventoryId;
        await customId.destroy({ transaction });
        return await reorderIds({ inventoryId, transaction });
    }),

    reorder: (inventoryId, positions) => db.transaction(async (transaction) => {
        return reorderIds({ inventoryId, positions, transaction });
    })
}

export default repository;