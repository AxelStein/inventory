import type { InventoryListFilter } from "api/inventory/inventory.types";
import type { InventoryTag } from "api/tag/tag.types";

interface InventoryListPageProps {
    tag?: InventoryTag;
    filter?: InventoryListFilter;
}

export default function InventoryListPage({ tag, filter }: InventoryListPageProps) {

}