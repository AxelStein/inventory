import {Col, Container} from "react-bootstrap";
import {InventoryTable, InventoryTableColumn} from "~/inventory/components/InventoryTable";

export default function DashboardPage() {

    return <Container>
        <Col>
            <InventoryTable title={'Latest inventories'} columns={[
                InventoryTableColumn.TITLE,
                InventoryTableColumn.DESCRIPTION,
                InventoryTableColumn.AUTHOR
            ]}/>

            <InventoryTable title={'Top 5 inventories'} columns={[
                InventoryTableColumn.TITLE,
                InventoryTableColumn.DESCRIPTION,
                InventoryTableColumn.AUTHOR,

            ]}/>

            <p>Tags</p>
        </Col>
    </Container>
}