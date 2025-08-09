import { control } from '../inventory/access/inventory.access.control.js';
import { ForbiddenError, NotFoundError } from "../error/index.js";
import InventoryAccessRole from "../inventory/access/inventory.access.role.js";
import inventoryRepository from '../inventory/inventory.repository.js';
import UserRole from '../user/user.role.js';

const getUserInventoryAccessRole = async (inventoryId, user) => {
    if (user.role === UserRole.ADMIN) {
        return InventoryAccessRole.OWNER;
    }
    const inventory = await inventoryRepository.getInventoryWithWriteAccess(inventoryId);
    if (!inventory) {
        throw new NotFoundError();
    }
    if (inventory.ownerId === user.id) {
        return InventoryAccessRole.OWNER;
    }
    if (inventory.isPublic) {
        return InventoryAccessRole.EDITOR;
    }
    const hasWriteAccess = inventory.writeAccess.find(e => e.userId === user.id) != null;
    return hasWriteAccess ? InventoryAccessRole.EDITOR : InventoryAccessRole.VIEWER;
}

const inventoryCheckAccess = (action, resource) => async (req, res, next) => {
    const role = getUserInventoryAccessRole(req.params.inventoryId, req.user);
    if (role && control.can(role)[action](resource).granted) {
        next();
    } else {
        throw new ForbiddenError();
    }
}

export default inventoryCheckAccess;