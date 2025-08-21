import Comment from './comment.model.js';

const repository = {

    getByIdWithInventory: (id) => Comment.findOne({
        where: { id },
        include: {
            association: 'post',
            include: [{
                association: 'inventory',
                include: [{ 
                    association: 'writeAccess' 
                }]
            }]
        }
    }),

    getList: async (postId, page, perPage) => {
        return Comment.getPage(page, perPage, {
            include: [{ association: 'author' }],
            where: { postId },
            order: [['createdAt', 'ASC']],
        });
    },

    getById: (id) => Comment.findOne({
        where: { id },
        include: [{ association: 'author' }]
    }),

    create: async (authorId, data) => {
        const comment = await Comment.create({ ...data, authorId });
        return repository.getById(comment.id);
    },

    update: async (id, data) => {
        const [count, rows] = await Comment.update(data, { where: { id } });
        if (count === 0) throw new Error('Comment not found');
        return repository.getById(id);
    },

    delete: (id) => Comment.destroy({ where: { id } }),
}

export default repository;