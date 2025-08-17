import CustomIdType from './custom.id.type.js';
import itemSequenceRepository from "./sequence/item.sequence.repository.js";
import customIdRepository from "./custom.id.repository.js";
import { Transaction } from "sequelize";
import customIdService from "./custom.id.service.js";

const getNextSequence = (inventoryId, transaction) => itemSequenceRepository.increment(inventoryId, transaction)

const setCustomIdPartsNextSequence = async (customIdParts, inventoryId, transaction) => {
    let nextSequence = 0;
    for (const part of customIdParts) {
        if (part.type !== CustomIdType.SEQUENCE) continue;

        if (nextSequence === 0) {
            nextSequence = await getNextSequence(inventoryId, transaction);
        }
        part.nextSequence = nextSequence;
    }
}

export const generateCustomId = async ({ inventoryId, transaction, parts }) => {
    const customIdParts = parts ? parts : await customIdService.getList(
        inventoryId,
        transaction,
        transaction ? Transaction.LOCK.UPDATE : null
    );
    await setCustomIdPartsNextSequence(customIdParts, inventoryId, transaction);
    return customIdParts.join('');
}