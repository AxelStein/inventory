import {pusher} from "./pusher.js";

class PostUpdatedEvent {
    constructor(post) {
        this.post = post;
    }

    broadcast() {
        pusher.trigger(
            `inventory-${this.post.inventoryId}`,
            'post-updated',
            { postId: this.post.id }
        ).catch((err) => console.log(err));
    }
}

export default PostUpdatedEvent;