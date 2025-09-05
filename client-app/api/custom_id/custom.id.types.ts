import type { CustomIdType } from "api/app/app.types";

export interface InventoryCustomId {
    id: number;
    type: CustomIdType | string;
    rule?: string | null;
    position: number;
    inventoryId: number;
}

export interface CreateCustomIdProps {
    inventoryId: number;
    type: CustomIdType | string;
    rule?: string | null;
}

export interface UpdateCustomIdProps {
    id: number;
    type: CustomIdType | string;
    rule?: string | null;
}

export interface ReorderCustomIdsProps {
    inventoryId: number;
    customIds: number[];
}