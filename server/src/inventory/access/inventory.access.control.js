import { AccessControl } from 'accesscontrol';
import AccessRole from './inventory.access.role.js';

export const RESOURCE_ITEM = 'item';
export const RESOURCE_INVENTORY = 'inventory';
export const RESOURCE_POST = 'post';
export const RESOURCE_POST_COMMENT = 'post-comment';
export const RESOURCE_TAG = 'tag';
export const RESOURCE_WRITE_ACCESS = 'write-access';
export const RESOURCE_CUSTOM_ID = 'custom-id';

export const control = new AccessControl();
control.grant(AccessRole.VIEWER)
    .read(RESOURCE_INVENTORY)
    .read(RESOURCE_ITEM)
    .read(RESOURCE_TAG)
    .read(RESOURCE_POST)
    .read(RESOURCE_POST_COMMENT);

control.grant(AccessRole.EDITOR)
    .extend(AccessRole.VIEWER)
    .create(RESOURCE_ITEM)
    .update(RESOURCE_ITEM)
    .delete(RESOURCE_ITEM)

    .create(RESOURCE_TAG)
    .delete(RESOURCE_TAG)
    
    .createOwn(RESOURCE_POST)
    .updateOwn(RESOURCE_POST)
    .deleteOwn(RESOURCE_POST)

    .createOwn(RESOURCE_POST_COMMENT)
    .updateOwn(RESOURCE_POST_COMMENT)
    .deleteOwn(RESOURCE_POST_COMMENT);

control.grant(AccessRole.OWNER)
    .extend(AccessRole.EDITOR)
    
    .update(RESOURCE_INVENTORY)
    .delete(RESOURCE_INVENTORY)
    
    .delete(RESOURCE_ITEM)
    .delete(RESOURCE_POST)
    .delete(RESOURCE_POST_COMMENT)

    .read(RESOURCE_WRITE_ACCESS)
    .create(RESOURCE_WRITE_ACCESS)
    .delete(RESOURCE_WRITE_ACCESS)

    .read(RESOURCE_CUSTOM_ID)
    .create(RESOURCE_CUSTOM_ID)
    .update(RESOURCE_CUSTOM_ID)
    .delete(RESOURCE_CUSTOM_ID);

control.grant(AccessRole.ADMIN)
    .extend(AccessRole.OWNER)
    .updateAny(RESOURCE_POST)
    .updateAny(RESOURCE_POST_COMMENT);
