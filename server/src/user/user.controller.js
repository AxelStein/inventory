import express from 'express';
import service from "./user.service.js";

const controller = {

    search: async (req, res) => {
        res.send(await service.search(req.validatedQuery));
    },

    getList: async (req, res) => {
        res.send(await service.getList(req.validatedQuery));
    },

    deleteOwnAccount: async (req, res) => {
        await service.deleteByIds([req.user.id]);
        res.clearCookie('token');
        res.sendStatus(200);
    },

    getOwnAccount: (req, res) => {
        res.send(req.user);
    },

    getAccountById: async (req, res) => {
        res.send(await service.getById(req.params.id));
    },

    blockByIds: async (req, res) => {
        const { ids, block } = req.body;
        await service.blockByIds(ids, block);
        res.sendStatus(200);
    },

    changeRoleByIds: async (req, res) => {
        const { ids, role } = req.body;
        await service.changeRoleByIds(ids, role);
        res.sendStatus(200);
    },

    deleteByIds: async (req, res) => {
        const { ids } = req.body;
        await service.deleteByIds(ids);
        res.sendStatus(200);
    },
}

export default controller;