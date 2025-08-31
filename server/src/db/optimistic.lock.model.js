import { literal } from "sequelize";
import { ConflictError } from '../error/index.js';
import {PagingModel} from "./paging.model.js";

export class OptimisticLockModel extends PagingModel {

    static async optimisticLockUpdate(id, data, transaction) {
        const [count, rows] = await this.update({
            ...data,
            version: literal('version + 1')
        }, {
            where: {
                id,
                version: data.version,
            },
            individualHooks: true,
            transaction
        });
        if (count === 0) throw new ConflictError();
        return rows[0];
    }
}