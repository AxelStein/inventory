import express from 'express';
import service from './inventory.service.js';

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getList: async (req, res) => {
        const { filter, sortBy, sortAsc } = req.validatedQuery;
        res.send(await service.getList(req.user.id, filter, sortBy, sortAsc));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: async (req, res) => {
        res.send(await service.create(req.user.id, req.body));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    update: async (req, res) => {
        res.send(await service.update(req.params.inventoryId, req.body));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
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

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    delete: async (req, res) => {
        await service.delete(req.params.inventoryId);
        res.sendStatus(200);
    },
}

export default controller;