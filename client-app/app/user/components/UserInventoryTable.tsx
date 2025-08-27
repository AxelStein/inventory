import { Col } from "react-bootstrap";
import UserInventoryToolbar from "~/user/components/UserInventoryToolbar";
import { InventoryTable, InventoryTableColumn } from "~/inventory/components/InventoryTable";

interface DashboardInventoryTableProps {
    isOwn: boolean;
}

export default function UserInventoryTable({ isOwn }: DashboardInventoryTableProps) {
    const columns = [
        InventoryTableColumn.CHECKBOX,
        InventoryTableColumn.IMAGE,
        InventoryTableColumn.TITLE,
        InventoryTableColumn.DESCRIPTION,
    ];
    if (!isOwn) {
        columns.push(InventoryTableColumn.AUTHOR);
    }
    return <Col>
        {isOwn && <UserInventoryToolbar />}

        <InventoryTable
            title={isOwn ? 'My inventories' : 'Inventories with write access'}
            columns={columns}
        />

        <span>Load more</span>
    </Col>

}