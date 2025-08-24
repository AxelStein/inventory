import service from './category.service.js';

const controller = {

    getList: async (req, res) => {
        res.send(await service.getList());
    },
}

export default controller;