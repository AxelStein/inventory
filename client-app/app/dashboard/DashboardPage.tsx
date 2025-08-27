import {Col, Container} from "react-bootstrap";
import {InventoryTable, InventoryTableColumn} from "~/inventory/components/InventoryTable";
import {useGetInventoriesQuery} from "../../api/inventory/inventory.api";

export default function DashboardPage() {

    const {data: popular, error: popularError, isLoading: popularLoading} = useGetInventoriesQuery({
        page: 1,
        perPage: 5,
        sortBy: 'itemCount',
        sortAsc: false
    });

    const {data: latest, error: latestError, isLoading: latestLoading} = useGetInventoriesQuery({
        page: 1,
        perPage: 5,
        sortBy: 'createdAt',
        sortAsc: false
    });

    return <Container>
        <Col>
            <InventoryTable title={'Latest inventories'} columns={[
                InventoryTableColumn.IMAGE,
                InventoryTableColumn.TITLE,
                InventoryTableColumn.DESCRIPTION,
                InventoryTableColumn.AUTHOR
            ]} inventories={latest?.items}/>

            <InventoryTable title={'Top 5 inventories'} columns={[
                InventoryTableColumn.TITLE,
                InventoryTableColumn.DESCRIPTION,
                InventoryTableColumn.AUTHOR,
                InventoryTableColumn.ITEM_COUNT,
            ]} inventories={popular?.items}/>

            <p>Tags</p>
        </Col>
    </Container>
}