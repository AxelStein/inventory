import service from "./user.settings.service.js";
import express from 'express';

const controller = {

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    save: async (req, res) => {
        res.send(await service.save(req.user.id, req.body));
    },

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    getForUser: async (req, res) => {
        res.send(await service.getForUser(req.user.id))
    }
}

export default controller;