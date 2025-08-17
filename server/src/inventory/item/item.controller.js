import express from 'express';
import service from './item.service.js';
import { v4 } from 'uuid';

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getList: async (req, res) => {
        const { inventoryId, sortBy, sortAsc, page, perPage } = req.validatedQuery;
        res.send(await service.getList(inventoryId, sortBy, sortAsc, page, perPage));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: async (req, res) => {
        res.send(await service.create(req.user.id, { ...req.body, customId: v4() }));
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
}

export default controller;