import db from "../../../db/index.js";
import {QueryTypes} from "sequelize";
import ItemSequence from "./item.sequence.model.js";

const repository = {

    increment: async (inventoryId, transaction) => {
        const q = `
            INSERT INTO item_sequences ("inventoryId", count)
            VALUES (:inventoryId, 1)
            ON CONFLICT ("inventoryId") DO UPDATE SET count = item_sequences.count + 1
            RETURNING count;
        `;
        const [result] = await db.query(q, {
            transaction: transaction,
            type: QueryTypes.INSERT,
            replacements: {inventoryId: inventoryId}
        });
        return result[0].count;
    }
}

export default repository;