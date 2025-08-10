import repository from "./category.repository.js";

const service = {

    getList: () => repository.getList()
}

export default service;