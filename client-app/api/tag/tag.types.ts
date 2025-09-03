export interface InventoryTag {
    id: number;
    name: string;
    inventoryCount?: number;
}

export interface GetTagsProps {
    asGuest?: boolean;
}

export interface CreateTagProps {
    inventoryId: number;
    name: string;
}

export interface DeleteTagProps {
    tagId: number;
    inventoryId: number;
}