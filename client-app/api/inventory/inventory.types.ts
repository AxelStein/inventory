import type { InventoryCategory } from "api/category/category.types";
import type { InventoryTag } from "api/tag/tag.types";
import type { User } from "api/user/user.types";

export interface Inventory {
    id: number;
    title: string;
    description?: string;
    imageLink?: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    itemCount?: number;
    version: number;
    category?: InventoryCategory;
    owner?: User;
    tags?: InventoryTag[];
}