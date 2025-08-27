import {Col} from "react-bootstrap";
import UserInventoryToolbar from "~/user/components/UserInventoryToolbar";
import {InventoryTable, InventoryTableColumn} from "~/inventory/components/InventoryTable";

interface DashboardInventoryTableProps {
    isOwn: boolean;
}

export default function UserInventoryTable({isOwn}: DashboardInventoryTableProps) {
    return <Col>
        {isOwn && <UserInventoryToolbar/>}

        <InventoryTable
            canCheckItems={isOwn}
            title={isOwn ? 'My inventories' : 'Inventories with write access'}
            columns={[
                InventoryTableColumn.TITLE,
                InventoryTableColumn.DESCRIPTION,
                InventoryTableColumn.AUTHOR,
            ]}
        />

        <span>Load more</span>
    </Col>

}