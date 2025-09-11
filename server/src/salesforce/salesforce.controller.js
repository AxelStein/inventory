import service from "./salesforce.service.js";

const controller = {

    createAccount: async (req, res) => {
        res.send(await service.createAccount(req.user.id, req.body));
    },

    getAccount: async (req, res) => {
        res.send(await service.getAccount(req.user.id));
    }
}

export default controller;