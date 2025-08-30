import { Col } from "react-bootstrap";
import UserInventoryToolbar from "~/user/components/UserInventoryToolbar";
import { InventoryTable, InventoryTableColumn } from "~/inventory/components/InventoryTable";
import { useTranslation } from "react-i18next";

interface DashboardInventoryTableProps {
    isOwn: boolean;
}

export default function UserInventoryTable({ isOwn }: DashboardInventoryTableProps) {
    const {t} = useTranslation();
    return <Col>
        {isOwn && <UserInventoryToolbar />}

        <InventoryTable title={t(isOwn ? 'dashboard.title.ownInventories' : 'dashboard.title.writeAccessInventories')} />

        <span>Load more</span>
    </Col>

}