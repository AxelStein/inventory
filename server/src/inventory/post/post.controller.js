import express from 'express';
import service from "./post.service.js";

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getById: async (req, res) => {
        res.send(await service.getById(req.params.id));
    },

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    getList: async (req, res) => {
        const { inventoryId, page, perPage } = req.validatedQuery;
        res.send(await service.getList(inventoryId, page, perPage));
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
    authPusher: async (req, res) => {
        const { socket_id, channel_name } = req.body;
        res.send(await service.authPusher(socket_id, channel_name));
    }
}

export default controller;