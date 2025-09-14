import repository from "./inventory.repository.js";
import crypto from "crypto";

const service = {

    getByIdWithWriteAccess: (id) => repository.getByIdWithWriteAccess(id),

    getList: (params) => repository.getList(params),

    getListByTag: (params) => repository.getListByTag(params),

    search: (params) => repository.search(params),

    getById: ({ reqUser, id, transaction, lock }) => repository.getById({ reqUser, id, transaction, lock }),

    create: ({ reqUser, data }) => repository.create({ reqUser, data }),

    createOdooToken: ({ reqUser, id, version }) => repository.createOdooToken({ 
        reqUser, 
        id, 
        version, 
        odooToken: crypto.randomUUID() 
    }),

    getByOdooToken: ({reqUser, odooToken}) => repository.getByOdooToken({
        reqUser,
        odooToken,
    }),

    update: ({ reqUser, id, data }) => repository.update({ reqUser, id, data }),

    delete: (id) => repository.delete(id),

    deleteImage: ({ reqUser, id, version }) => repository.deleteImage({ reqUser, id, version })
}

export default service;