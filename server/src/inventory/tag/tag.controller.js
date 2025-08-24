import express from 'express';
import service from "./tag.service.js";

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getFromInventory: async (req, res) => {
        res.send(await service.getFromInventory(req.params.inventoryId));
    },

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    getList: async (req, res) => {
        res.send(await service.getList());
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: async (req, res) => {
        const { inventoryId, name } = req.body;
        await service.create(inventoryId, name);
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    delete: async (req, res) => {
        const { inventoryId, id } = req.params;
        await service.delete(id, inventoryId);
        res.sendStatus(200);
    },
}

export default controller;