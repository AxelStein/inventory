import service from "./custom.id.service.js";

const controller = {

    getList: async (req, res) => {
        res.send(await service.getList(req.validatedQuery.inventoryId));
    },

    create: async (req, res) => {
        res.send(await service.create(req.body));
    },

    update: async (req, res) => {
        res.send(await service.update(req.params.id, req.body));
    },

    delete: async (req, res) => {
        res.send(await service.delete(req.params.id));
    },

    reorder: async (req, res) => {
        const { inventoryId, customIds } = req.body;
        res.send(await service.reorder(inventoryId, customIds));
    },
}

export default controller;