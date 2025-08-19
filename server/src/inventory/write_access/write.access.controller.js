import express from 'express';
import service from "./write.access.service.js";

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getList: async (req, res) => {
        res.send(await service.getList(req.validatedQuery.inventoryId));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: async (req, res) => {
        const { inventoryId, userId } = req.body;
        res.send(await service.create(inventoryId, userId));
    },
    
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    delete: async (req, res) => {
        await service.delete(req.params.id);
        res.sendStatus(200);
    },
}

export default controller;