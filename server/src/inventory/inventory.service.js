import repository from "./inventory.repository.js";
import db from "../db/index.js";

const service = {

    getByIdWithWriteAccess: (id) => repository.getByIdWithWriteAccess(id),

    getList: () => repository.getList(),

    create: (data) => repository.create(data),

    update: (id, data) => repository.update(id, data),
}

export default service;