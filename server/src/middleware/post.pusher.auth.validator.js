import {ForbiddenError} from "../error/index.js";

export const validatePostPusherAuth = (req, res, next) => {
    const { channel_name } = req.body;
    if (!channel_name.startsWith('private-inventory-posts-')) {
        throw new ForbiddenError();
    }
    req.body.inventoryId = channel_name.split('-')[3];
    next();
}