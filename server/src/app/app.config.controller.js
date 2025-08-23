import {appConfig} from "./app.config.js";

const controller = {

    getConfig: (req, res) => {
        res.send(appConfig);
    }
};

export default controller;