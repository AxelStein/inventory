import service from './item.service.js';

const controller = {

    getList: async (req, res) => {
        const { inventoryId, sortBy, sortAsc, page, perPage, q } = req.validatedQuery;
        res.send(await service.getList(inventoryId, sortBy, sortAsc, page, perPage, q));
    },

    create: async (req, res) => {
        res.send(await service.create(req.user.id, { ...req.body }));
    },

    update: async (req, res) => {
        res.send(await service.update(req.params.id, req.body));
    },

    delete: async (req, res) => {
        await service.delete(req.params.id);
        res.sendStatus(200);
    },
}

export default controller;