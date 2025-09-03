import service from "./tag.service.js";

const controller = {

    getFromInventory: async (req, res) => {
        res.send(await service.getFromInventory(req.params.inventoryId));
    },

    getList: async (req, res) => {
        res.send(await service.getList());
    },

    create: async (req, res) => {
        const { inventoryId, name } = req.body;
        res.send(await service.create(inventoryId, name));
    },

    delete: async (req, res) => {
        const { inventoryId, id } = req.params;
        await service.delete(id, inventoryId);
        res.sendStatus(200);
    },
}

export default controller;