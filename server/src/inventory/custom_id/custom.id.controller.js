import express from 'express';
import service from "./custom.id.service.js";

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getList: async (req, res) => {
        res.send(await service.getList(req.validatedQuery.inventoryId))
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: async (req, res) => {
        res.send(await service.create(req.body));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    update: async (req, res) => {
        res.send(await service.update(req.params.id, req.body));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    delete: async (req, res) => {
        await service.delete(req.params.id);
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    reorder: async (req, res) => {
        const { inventoryId, customIds } = req.body;
        res.send(await service.reorder(inventoryId, customIds));
    },
}

export default controller;