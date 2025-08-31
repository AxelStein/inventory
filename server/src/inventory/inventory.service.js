import repository from "./inventory.repository.js";

const service = {

    getByIdWithWriteAccess: (id) => repository.getByIdWithWriteAccess(id),

    getList: (params) => repository.getList(params),

    getListByTag: (params) => repository.getListByTag(params),

    search: (params) => repository.search(params),

    getById: (id) => repository.getById(id),

    create: (ownerId, data) => repository.create(ownerId, data),

    update: (id, data) => repository.update(id, data),

    delete: (id) => repository.delete(id),

    deleteImage: (id, version) => repository.deleteImage(id, version)
}

export default service;