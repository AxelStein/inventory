import repository from "./post.repository.js";

const service = {

    getById: (id) => repository.getById(id),
}

export default service;