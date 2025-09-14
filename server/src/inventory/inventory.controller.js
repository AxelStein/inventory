import service from './inventory.service.js';

const controller = {

    getList: async (req, res) => {
        const params = req.validatedQuery || {};
        params.userId = params.userId || req.user?.id;
        res.send(params.tagId ? await service.getListByTag(params) : await service.getList(params));
    },

    search: async (req, res) => {
        res.send(await service.search(req.validatedQuery));
    },

    getById: async (req, res) => {
        res.send(await service.getById({ reqUser: req.user, id: req.params.inventoryId }));
    },

    create: async (req, res) => {
        res.send(await service.create({ reqUser: req.user, data: req.body }));
    },

    createOdooToken: async (req, res) => {
        res.send(await service.createOdooToken({
            reqUser: req.user,
            id: req.params.inventoryId,
            version: req.body.version
        }));
    },

    getByOdooToken: async (req, res) => {
        res.send(await service.getByOdooToken({ reqUser: req.user, odooToken: req.validatedQuery.token }));
    },

    update: async (req, res) => {
        res.send(await service.update({
            reqUser: req.user,
            id: req.params.inventoryId,
            data: req.body
        }));
    },

    uploadImage: async (req, res) => {
        res.send(
            await service.update({
                reqUser: req.user,
                id: req.params.inventoryId,
                data: {
                    version: req.query.version,
                    imageLink: req.file.location
                }
            })
        );
    },

    delete: async (req, res) => {
        await service.delete(req.params.inventoryId);
        res.sendStatus(200);
    },

    deleteImage: async (req, res) => {
        res.send(await service.deleteImage({
            reqUser: req.user,
            id: req.params.inventoryId,
            version: req.validatedQuery?.version
        }));
    }
}

export default controller;