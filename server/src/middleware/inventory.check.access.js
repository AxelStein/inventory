import { control } from '../inventory/access/inventory.access.control.js';
import { ForbiddenError, NotFoundError } from "../error/index.js";
import InventoryAccessRole from "../inventory/access/inventory.access.role.js";
import inventoryService from '../inventory/inventory.service.js';
import postService from '../inventory/post/post.service.js';
import UserRole from '../user/user.role.js';

const getUserInventoryAccessRole = async (user, inventoryIdProvider) => {
    if (user.role === UserRole.ADMIN) {
        return InventoryAccessRole.OWNER;
    }
    const inventory = await inventoryService.getByIdWithWriteAccess(await inventoryIdProvider());
    if (!inventory) {
        throw new NotFoundError();
    }
    if (inventory.ownerId === user.id) {
        return InventoryAccessRole.OWNER;
    }
    if (inventory.isPublic) {
        return InventoryAccessRole.EDITOR;
    }
    return inventory.writeAccess.find(e => e.userId === user.id) ? InventoryAccessRole.EDITOR : InventoryAccessRole.VIEWER;
}

const checkPermission = (role, action, resource, next) => {
    if (role && control.can(role)[action](resource).granted) {
        next();
    } else {
        throw new ForbiddenError();
    }
}

const checkAccess = async (action, resource, req, res, next, inventoryIdProvider) => {
    checkPermission(
        await getUserInventoryAccessRole(req.user, inventoryIdProvider), 
        action, 
        resource,
        next
    );
}

export const inventoryPostCheckAccess = (action, resource) => async (req, res, next) => {
    await checkAccess(action, resource, req, res, next, async () => {
        const inventoryId = req.body ? req.body.inventoryId : undefined;
        const postId = req.params.id;
        if (inventoryId) {
            return inventoryId;
        } else {
            const post = await postService.getById(postId);
            if (!post) {
                throw new NotFoundError();
            }
            // todo const isOwn = post.authorId === req.user.id;
            return post.inventoryId;
            
            // get post
            // check is own
            // pass inventory id
        }
    });
}

export const inventoryCheckAccess = (action, resource) => async (req, res, next) => {
    await checkAccess(action, resource, req, res, next, () => req.params.inventoryId);
}