import service from "./write.access.service.js";

const controller = {

    getList: async (req, res) => {
        res.send(await service.getList(req.validatedQuery.inventoryId));
    },

    create: async (req, res) => {
        const { inventoryId, userId } = req.body;
        res.send(await service.create(inventoryId, userId));
    },

    delete: async (req, res) => {
        await service.delete(req.params.id);
        res.sendStatus(200);
    },
}

export default controller;