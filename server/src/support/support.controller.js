import service from "./support.service.js";

const controller = {

    createTicket: async (req, res) => {
        await service.createTicket(req.user, req.body);
        res.sendStatus(200);
    }
}

export default controller;