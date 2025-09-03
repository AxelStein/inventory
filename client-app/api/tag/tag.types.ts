export interface InventoryTag {
    id: number;
    name: string;
    inventoryCount?: number;
}

export interface GetTagsProps {
    asGuest?: boolean;
}