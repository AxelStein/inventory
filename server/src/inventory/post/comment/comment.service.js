import repository from "./comment.repository.js";

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),
}

export default service;