import repository from "./item.like.repository.js";

const service = {

    create: (itemId, userId) => repository.create(itemId, userId),

    delete: (itemId, userId) => repository.delete(itemId, userId)
}

export default service;