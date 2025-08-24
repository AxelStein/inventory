import service from "./item.like.service.js";

const controller = {

    create: async (req, res) => {
        await service.create(req.params.id, req.user.id);
        res.sendStatus(200);
    },

    delete: async (req, res) => {
        await service.delete(req.params.id, req.user.id);
        res.sendStatus(200);
    },
}

export default controller;