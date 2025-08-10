import express from 'express';

const controller = {

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    searchUser: (req, res) => {
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    saveSettings: (req, res) => {
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    deleteAccount: (req, res) => {
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getOwnAccount: (req, res) => {
        res.send(req.user);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getUserAccount: (req, res) => {
        res.sendStatus(200);
    },
    
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    blockUser: (req, res) => {
        res.sendStatus(200);
    },
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    unblockUser: (req, res) => {
        res.sendStatus(200);
    },
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    changeUserRole: (req, res) => {
        res.sendStatus(200);
    },
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    deleteUser: (req, res) => {
        res.sendStatus(200);
    },
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    getUsers: (req, res) => {
        res.sendStatus(200);
    },
}

export default controller;