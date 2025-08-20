import ItemLike from "./item.like.model.js";

const repository = {

    create: (itemId, userId) => ItemLike.create({ itemId, userId }),

    delete: (itemId, userId) => ItemLike.destroy({ where: { itemId, userId } })
}

export default repository;