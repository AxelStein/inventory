import express from 'express';
import service from "./user.service.js";

const controller = {

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    search: async (req, res) => {
        res.send(await service.search()); // todo
    },

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    getList: async (req, res) => {
        const { sortBy, sortAsc, page, perPage } = req.validatedQuery;
        res.send(await service.getList(sortBy, sortAsc, page, perPage));
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    deleteOwnAccount: async (req, res) => {
        await service.deleteByIds([req.user.id]);
        res.clearCookie('token');
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
    getAccountById: async (req, res) => {
        res.send(await service.getById(req.params.id));
    },
    
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    blockByIds: async (req, res) => {
        const { ids, block } = req.body;
        await service.blockByIds(ids, block);
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    changeRoleByIds: async (req, res) => {
        const { ids, role } = req.body;
        await service.changeRoleByIds(ids, role);
        res.sendStatus(200);
    },

    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    deleteByIds: async (req, res) => {
        const { ids } = req.body;
        await service.deleteByIds(ids);
        res.sendStatus(200);
    },
}

export default controller;