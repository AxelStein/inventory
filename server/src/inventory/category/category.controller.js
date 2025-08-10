import express from 'express';
import service from './category.service.js';

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getList: async (req, res) => {
        res.send(await service.getList());
    },
}

export default controller;