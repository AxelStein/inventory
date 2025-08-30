import type { Inventory, InventoryField } from "api/inventory/inventory.types";
import { useGetItemsQuery } from "api/item/item.api";
import type { InventoryItem } from "api/item/item.types";
import { Table } from "react-bootstrap";

interface ItemPageProps {
    inventory: Inventory;
}

export default function ItemPage({ inventory }: ItemPageProps) {
    const { data, isLoading } = useGetItemsQuery({ inventoryId: inventory.id });
    if (!data || isLoading) {
        return <div className="spinner" />;
    }
    const fields = inventory.fields?.filter(f => f.state == 'visible') || [];
    return <Table responsive>
        <thead>
            <tr>
                {fields.map(createColumn)}
            </tr>
        </thead>
        <tbody>
            {data.items.map(item => createRow(item, fields))}
        </tbody>
    </Table>
}

function createColumn(field: InventoryField) {
    return <th>{field.name}</th>;
}

function createRow(item: InventoryItem, fields: InventoryField[]) {
    return <tr>{
        fields.map(field => {
            return <td>{(item as any)[field.uid]}</td>;
        })
    }</tr>;
}