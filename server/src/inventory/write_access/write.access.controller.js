import express from 'express';

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getList: (req, res) => {
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    create: (req, res) => {
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