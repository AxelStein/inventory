import repository from "./inventory.repository.js";
import {pusher} from "../events/pusher.js";
import {ForbiddenError} from "../error/index.js";

const service = {

    getByIdWithWriteAccess: (id) => repository.getByIdWithWriteAccess(id),

    getList: (userId, filter, sortBy, sortAsc, page, perPage) => repository.getList(userId, filter, sortBy, sortAsc, page, perPage),

    getById: (id) => repository.getById(id),

    create: (ownerId, data) => repository.create(ownerId, data),

    update: (id, data) => repository.update(id, data),

    delete: (id) => repository.delete(id),
}

export default service;