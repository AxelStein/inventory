import express from 'express';
import service from "./item.like.service.js";

const controller = {

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: async (req, res) => {
        await service.create(req.params.id, req.user.id);
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    delete: async (req, res) => {
        await service.delete(req.params.id, req.user.id);
        res.sendStatus(200);
    },
}

export default controller;