import express from 'express';
import service from './inventory.service.js';

const controller = {
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
        req.body.ownerId = req.user.id;
        res.send(await service.create(req.body));
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
    uploadImage: (req, res) => {
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    delete: (req, res) => {
        res.sendStatus(200);
    },
}

export default controller;