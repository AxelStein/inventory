import repository from "./inventory.repository.js";

const service = {

    getByIdWithWriteAccess: (id) => repository.getByIdWithWriteAccess(id),

    getList: (userId, filter, sortBy, sortAsc) => repository.getList(userId, filter, sortBy, sortAsc),

    create: (ownerId, data) => repository.create(ownerId, data),

    update: (id, data) => repository.update(id, data),

    delete: (id) => repository.delete(id),
}

export default service;