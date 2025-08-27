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

export interface InventoryCategory {
    id: number;
    name: string;
}

export interface InventoryTag {
    id: number;
    name: string;
}

export interface PagingList<T> {
    items: T[],
    totalCount: number,
    hasMore: boolean,
}

export interface UploadImageProps {
    inventoryId: number;
    version: number;
    formData: FormData;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    verified: boolean;
    isBlocked: boolean;
    lastSeen: string;
}