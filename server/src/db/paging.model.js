import { Model } from "sequelize";

export class PagingModel extends Model {

    static async getPage(page, perPage, options) {
        const count = await this.count({...options});
        const rows = await this.findAll({
            ...options,
            limit: perPage,
            offset: (page - 1) * perPage,
        });
        return {
            totalCount: count,
            hasMore: page * perPage < count,
            items: rows,
        };
    }
}