import service from "./user.settings.service.js";
import express from 'express';

const controller = {

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    save: async (req, res) => {
        res.send(await service.save(req.user.id, req.body));
    }
}

export default controller;