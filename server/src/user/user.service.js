import repository from "./user.repository.js";
import {NotFoundError, ValidationError} from "../error/index.js";
import db from "../db/index.js";

const service = {

    search: (params) => repository.search(params),

    getList: (params) => repository.getList(params),

    getById: async (id) => {
        const user = await repository.getNotBlocked(id);
        if (!user) throw new NotFoundError(__('user.error.notFound'));
        return user;
    },

    blockByIds: async (ids, block) => db.transaction(async (transaction) => {
        const [count] = await repository.blockByIds(ids, block, transaction);
        if (count !== ids.length) throw new ValidationError(__('user.error.invalidIds'));
    }),

    deleteByIds: async (ids) => db.transaction(async (transaction) => {
        const count = await repository.deleteByIds(ids, transaction);
        if (count !== ids.length) throw new ValidationError(__('user.error.invalidIds'));
    }),

    changeRoleByIds: async (ids, role) => db.transaction(async (transaction) => {
        const [count] = await repository.changeRoleByIds(ids, role, transaction);
        if (count !== ids.length) throw new ValidationError(__('user.error.invalidIds'));
    }),

    setSaleforceAccountId: (userId, accountId) => repository.setSaleforceAccountId(userId, accountId),
}

export default service;