import service from "./post.service.js";

const controller = {

    getById: async (req, res) => {
        res.send(await service.getById(req.params.id));
    },

    getList: async (req, res) => {
        const { inventoryId, page, perPage } = req.validatedQuery;
        res.send(await service.getList(inventoryId, page, perPage));
    },

    create: async (req, res) => {
        res.send(await service.create(req.user.id, req.body));
    },

    update: async (req, res) => {
        res.send(await service.update(req.params.id, req.body));
    },

    delete: async (req, res) => {
        await service.delete(req.params.id);
        res.sendStatus(200);
    },

    authPusher: async (req, res) => {
        const { socket_id, channel_name } = req.body;
        res.send(await service.authPusher(socket_id, channel_name));
    }
}

export default controller;