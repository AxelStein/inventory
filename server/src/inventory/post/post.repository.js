import Post from './post.model.js';

const repository = {

    getById: (id) => Post.findByPk(id),

    getByIdWithInventory: (id) => Post.findOne({ 
        where: { id }, 
        include: { 
            association: 'inventory', 
            include: [{ 
                association: 'writeAccess' 
            }]
        } 
    }),
}

export default repository;