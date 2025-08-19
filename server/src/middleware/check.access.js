import { control, RESOURCE_CUSTOM_ID, RESOURCE_INVENTORY, RESOURCE_ITEM, RESOURCE_POST, RESOURCE_POST_COMMENT, RESOURCE_TAG, RESOURCE_WRITE_ACCESS } from '../inventory/access/inventory.access.control.js';
import { ForbiddenError, NotFoundError } from "../error/index.js";
import InventoryAccessRole from "../inventory/access/inventory.access.role.js";
import postService from '../inventory/post/post.service.js';
import UserRole from '../user/user.role.js';
import inventoryService from '../inventory/inventory.service.js';
import commentService from '../inventory/post/comment/comment.service.js';
import itemService from '../inventory/item/item.service.js';
import writeAccessService from '../inventory/write_access/write.access.service.js';
import customIdService from '../inventory/custom_id/custom.id.service.js';

class InventoryEntity {
    constructor(inventory, isOwn = true) {
        this.isOwn = isOwn;
        this.inventory = inventory;
    }
}

const getInventoryAccessRole = (user, inventory) => {
    if (!inventory) {
        throw new NotFoundError('Inventory not found');
    }
    if (user.role === UserRole.ADMIN) {
        return InventoryAccessRole.ADMIN;
    }
    if (inventory.ownerId === user.id) {
        return InventoryAccessRole.OWNER;
    }
    if (inventory.isPublic) {
        return InventoryAccessRole.EDITOR;
    }
    return inventory.writeAccess?.find(e => e.userId === user.id) ? InventoryAccessRole.EDITOR : InventoryAccessRole.VIEWER;
}

const checkHasPermission = (role, action, resource, isOwn) => {
    const permission = isOwn ? control.can(role)[action.own](resource) : control.can(role)[action.any](resource);
    if (!permission.granted) {
        throw new ForbiddenError();
    }
}

const findAttribute = (req, attribute) => req.body?.[attribute] || req.params?.[attribute] || req.query?.[attribute]

const checkResourceAccess = (action, resource, getInventoryEntity) => async (req, res, next) => {
    const inventoryId = findAttribute(req, 'inventoryId');
    let inventory, isOwn;

    if (inventoryId) {
        isOwn = true;
        inventory = await inventoryService.getByIdWithWriteAccess(inventoryId);
    } else {
        const entity = await getInventoryEntity(req);
        inventory = entity.inventory;
        isOwn = entity.isOwn;
    }

    const role = getInventoryAccessRole(req.user, inventory);
    checkHasPermission(role, action, resource, isOwn);
    next();
}

const getPostById = async (id) => {
    const post = await postService.getByIdWithInventory(id);
    if (!post) throw new NotFoundError('Post not found');
    return post;
}

export const checkInventoryAccess = (action) => checkResourceAccess(action, RESOURCE_INVENTORY, () => {})

export const checkPostAccess = (action) => checkResourceAccess(action, RESOURCE_POST, async (req) => {
    const post = await getPostById(req.params.id);
    return new InventoryEntity(
        post.inventory,
        post.authorId === req.user.id,
    )
})

export const checkPostCommentAccess = (action) => checkResourceAccess(action, RESOURCE_POST_COMMENT, async (req) => {
    const postId = findAttribute(req, 'postId');
    if (postId) {
        const post = await getPostById(postId);
        return new InventoryEntity(post.inventory);
    }

    const comment = await commentService.getByIdWithInventory(req.params.id);
    if (!comment) throw new NotFoundError('Comment not found');
    return new InventoryEntity(
        comment.post.inventory,
        comment.authorId === req.user.id,
    );
})

export const checkItemAccess = (action) => checkResourceAccess(action, RESOURCE_ITEM, async (req) => {
    const item = await itemService.getByIdWithInventory(req.params.id);
    if (!item) throw new NotFoundError('Item not found');
    return new InventoryEntity(
        item.inventory,
        item.creatorId === req.user.id,
    )
})

export const checkTagAccess = (action) => checkResourceAccess(action, RESOURCE_TAG)

export const checkWriteAccess = (action) => checkResourceAccess(action, RESOURCE_WRITE_ACCESS, async (req) => {
    const item = await writeAccessService.getByIdWithInventory(req.params.id);
    if (!item) throw new NotFoundError();
    return new InventoryEntity(item.inventory);
})

export const checkCustomIdAccess = (action) => checkResourceAccess(action, RESOURCE_CUSTOM_ID, async (req) => {
    const item = await customIdService.getByIdWithInventory(req.params.id);
    if (!item) throw new NotFoundError('Custom id not found');
    return new InventoryEntity(item.inventory);
})