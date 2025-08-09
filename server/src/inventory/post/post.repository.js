import Post from './post.model.js';

const repository = {

    getById: (id) => Post.findByPk(id),
}

export default repository;