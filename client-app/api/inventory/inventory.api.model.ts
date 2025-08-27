import type {UserApiModel} from "../user/user.api.model";

export interface InventoryApiModel {
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
    owner?: UserApiModel
}

export interface InventoryCategory {
    id: number;
    name: string;
}