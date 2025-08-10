import Category from "./category.model.js";

const repository = {

    getList: () => Category.findAll({ order: [['name', 'ASC']] })
}

export default repository;