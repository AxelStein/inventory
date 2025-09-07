import type { InventoryCategory } from "api/category/category.types";
import type { InventoryTag } from "api/tag/tag.types";
import type { PagingListProps } from "api/types";
import type { User } from "api/user/user.types";

export interface Inventory {
    id: number;
    title: string;
    description?: string | null;
    imageLink?: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    itemCount?: number;
    version: number;
    category?: InventoryCategory | null;
    owner?: User | null;
    tags?: InventoryTag[] | null;
    fields?: InventoryField[] | null;
    permissions?: InventoryPermissionSet;
}

export interface InventoryPermissionSet {
    item: InventoryPermissions;
    inventory: InventoryPermissions;
    post: InventoryPermissions;
    tag: InventoryPermissions;
    writeAccess: InventoryPermissions;
    customId: InventoryPermissions;
}

export interface InventoryPermissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    createOwn: boolean;
    readOwn: boolean;
    updateOwn: boolean;
    deleteOwn: boolean;
}

export interface GetInventoriesProps extends PagingListProps {
    filter?: string;
    tagId?: string;
    asGuest?: boolean;
}

export interface GetInventoryByIdProps {
    id: number;
    asGuest?: boolean;
}

export interface InventoryField {
    uid: string;
    name: string;
    description?: string | null;
    state: InventoryFieldState;
    type: InventoryFieldType | string;
}

export enum InventoryFieldType {
    customId = 'customId',
    string = 'string',
    text = 'text',
    int = 'int',
    link = 'link',
    boolean = "boolean",
}

export enum InventoryFieldState {
    visible = 'visible',
    hidden = 'hidden'
}

export interface UpdateInventoryProps {
    id: number;
    body: any;
}

export enum InventoryListFilter {
    own = 'own',
    writeAccess = 'writeAccess',
}