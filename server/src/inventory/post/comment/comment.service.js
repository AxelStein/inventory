import repository from "./comment.repository.js";

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (postId, page, perPage) => repository.getList(postId, page, perPage),

    create: (authorId, data) => repository.create(authorId, data),

    update: (id, data) => repository.update(id, data),

    delete: (id) => repository.delete(id)
}

export default service;