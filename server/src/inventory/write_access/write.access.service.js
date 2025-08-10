import repository from "./write.access.repository.js";

const service = {

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id)
}

export default service;