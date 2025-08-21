import {pusher} from "./pusher.js";

class PostDeletedEvent {
    constructor(post) {
        this.post = post;
    }

    broadcast() {
        pusher.trigger(
            `inventory-${this.post.inventoryId}`,
            'post-deleted',
            { postId: this.post.id }
        ).catch((err) => console.log(err));
    }
}

export default PostDeletedEvent;