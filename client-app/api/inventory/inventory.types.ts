import type { InventoryCategory } from "api/category/category.types";
import type { InventoryTag } from "api/tag/tag.types";
import type { PagingListParams } from "api/types";
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
}

export interface GetInventoriesParams extends PagingListParams {
    filter?: string;
}

export interface InventoryField {
    uid: string;
    name: string;
    description?: string | null;
    state: string;
    type: string;
}