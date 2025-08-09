import express from 'express';

const controller = {
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getList: (req, res) => {
        res.sendStatus(200);
    },
}

export default controller;