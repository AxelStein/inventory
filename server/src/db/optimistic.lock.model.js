import { literal, Model } from "sequelize";
import { ConflictError } from '../error/index.js';

export class OptimisticLockModel extends Model {

    static async optimisticLockUpdate(id, data) {
        const [count, rows] = await this.update({
            ...data,
            version: literal('version + 1')
        }, {
            where: {
                id,
                version: data.version,
            },
            returning: true,
        });
        if (count === 0) throw new ConflictError();
        return rows[0];
    }
}