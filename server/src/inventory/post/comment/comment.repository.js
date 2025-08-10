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
    })
}

export default repository;