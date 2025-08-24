import express from 'express';
import service from './inventory.service.js';

const controller = {

    getList: async (req, res) => {
        const params = req.validatedQuery || {};
        params.userId = req.user?.id;
        res.send(await service.getList(params));
    },

    getListByTag: async (req, res) => {
        const params = req.validatedQuery || {};
        params.tagId = req.params.tagId;
        res.send(await service.getListByTag(params));
    },

    search: async (req, res) => {
        res.send(await service.search(req.validatedQuery));
    },

    getById: async (req, res) => {
        res.send(await service.getById(req.params.inventoryId));
    },

    create: async (req, res) => {
        res.send(await service.create(req.user.id, req.body));
    },

    update: async (req, res) => {
        res.send(await service.update(req.params.inventoryId, req.body));
    },

    uploadImage: async (req, res) => {
        res.send(
            await service.update(
                req.params.inventoryId,
                {
                    version: req.query.version,
                    imageLink: req.file.location
                }
            )
        );
    },

    delete: async (req, res) => {
        await service.delete(req.params.inventoryId);
        res.sendStatus(200);
    },
}

export default controller;