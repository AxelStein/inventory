import {pusher} from "./pusher.js";

class PostCreatedEvent {

    constructor(post) {
        this.post = post;
    }

    broadcast() {
        pusher.trigger(
            `inventory-${this.post.inventoryId}`,
            'post-created',
            { postId: this.post.id }
        ).catch((err) => console.log(err));
    }
}

export default PostCreatedEvent;