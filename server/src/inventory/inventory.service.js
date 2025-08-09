import repository from "./inventory.repository.js";

const service = {

    getByIdWithWriteAccess: (id) => repository.getByIdWithWriteAccess(id),
}

export default service;