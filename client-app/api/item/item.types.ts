import type { PagingListParams } from "api/types";
import type { User } from "api/user/user.types";

export interface InventoryItem {
    id: number;
    customId: string;
    inventoryId: number;
    customString1: string | null;
    customString2: string | null;
    customString3: string | null;
    customText1: string | null;
    customText2: string | null;
    customText3: string | null;
    customInt1: number | null;
    customInt2: number | null;
    customInt3: number | null;
    customLink1: string | null;
    customLink2: string | null;
    customLink3: string | null;
    customBoolean1: boolean | null;
    customBoolean2: boolean | null;
    customBoolean3: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    creatorId: number;
    likes: InventoryItemLike[] | null;
}

export interface InventoryItemLike {
    createdAt: Date;
    user: User;
}

export interface GetInventoryItemsParams extends PagingListParams {
    inventoryId: number;
}