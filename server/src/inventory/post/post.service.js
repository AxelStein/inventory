import repository from "./post.repository.js";
import PostCreatedEvent from "../../events/post.created.event.js";
import PostUpdatedEvent from "../../events/post.updated.event.js";
import PostDeletedEvent from "../../events/post.deleted.event.js";
import {pusher} from "../../events/pusher.js";

const service = {

    getById: (id) => repository.getById(id),

    getByIdWithInventory: (id) => repository.getByIdWithInventory(id),

    getList: (inventoryId, page, perPage) => repository.getList(inventoryId, page, perPage),

    create: async (authorId, data) => {
        const post = await repository.create(authorId, data);
        new PostCreatedEvent(post).broadcast();
        return post;
    },

    update: async (id, data) => {
        const post = await repository.update(id, data);
        new PostUpdatedEvent(post).broadcast();
        return post;
    },

    delete: async (id) => {
        const post = await repository.getById(id);
        await repository.delete(id);
        new PostDeletedEvent(post).broadcast();
    },

    authPusher: (socketId, channel) => {
        return pusher.authorizeChannel(socketId, channel);
    }
}

export default service;