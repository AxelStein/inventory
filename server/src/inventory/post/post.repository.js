import Post from './post.model.js';
import {Sequelize} from "sequelize";

const postOptions = {
    attributes: {
        include: [
            [
                Sequelize.literal(`(
                    SELECT CAST(COUNT(*) AS INTEGER) 
                    FROM inventory_post_comments AS "comment" 
                    WHERE "comment"."postId" = "InventoryPost"."id"                    
                )`),
                'commentCount'
            ]
        ]
    },
    include: [{ association: 'author' }],
};

const repository = {

    getById: (id) => Post.findOne({
        where: { id },
        ...postOptions,
    }),

    getByIdWithInventory: (id) => Post.findOne({
        where: { id },
        include: { 
            association: 'inventory', 
            include: [{ 
                association: 'writeAccess' 
            }]
        } 
    }),

    getList: (inventoryId, page, perPage) => Post.getPage(page, perPage,{
        where: { inventoryId },
        order: [['createdAt', 'ASC']],
        ...postOptions,
    }),

    create: async (authorId, data) => {
        const post = await Post.create({
            ...data,
            authorId,
        });
        return repository.getById(post.id);
    },

    update: async (id, data) => {
        const [count, rows] = await Post.update(data, {
            where: { id },
            returning: true,
        });
        if (count === 0) throw new Error(__('post.error.notFound'));
        return repository.getById(id);
    },

    delete: (id) => Post.destroy({ where: { id } })
}

export default repository;