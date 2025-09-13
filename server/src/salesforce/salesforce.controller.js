import service from "./salesforce.service.js";

const controller = {

    createAccount: async (req, res) => {
        res.send(await service.createAccount(req.body));
    },

    getAccount: async (req, res) => {
        res.send(await service.getAccountByUser(req.user.id));
    }
}

export default controller;