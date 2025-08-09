import { AccessControl } from 'accesscontrol';
import AccessRole from './inventory.access.role.js';

export const ITEM = 'item';
export const INVENTORY = 'inventory';
export const INVENTORY_IMAGE = 'inventory-image';
export const POST = 'post';
export const POST_COMMENT = 'post-comment';

export const control = new AccessControl();
control.grant(AccessRole.VIEWER)
    .read(INVENTORY)
    .read(ITEM);

control.grant(AccessRole.EDITOR)
    .extend(AccessRole.VIEWER)
    .create(ITEM)
    .update(ITEM)
    .delete(ITEM)
    
    .createOwn(POST)
    .updateOwn(POST)
    .deleteOwn(POST)

    .createOwn(POST_COMMENT)
    .updateOwn(POST_COMMENT)
    .deleteOwn(POST_COMMENT);

control.grant(AccessRole.OWNER)
    .extend(AccessRole.EDITOR)
    .update(INVENTORY)
    .update(INVENTORY_IMAGE)
    .delete(INVENTORY)
    .delete(ITEM)
    .deleteAny(POST)
    .deleteAny(POST_COMMENT);