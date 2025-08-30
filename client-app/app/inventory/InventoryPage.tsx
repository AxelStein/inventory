import { useGetInventoryByIdQuery } from "api/inventory/inventory.api";
import { useCallback } from "react";
import InventoryEditorForm from "./components/InventoryEditorForm";
import { Col, Container, Tab, Tabs } from "react-bootstrap";
import ItemPage from "~/inventory/item/ItemPage";

interface InventoryPageProps {
    inventoryId: number;
}

export default function InventoryPage({ inventoryId }: InventoryPageProps) {
    const { data: inventory, refetch: refetchInventory, isLoading } = useGetInventoryByIdQuery(inventoryId);
    const onForceRefresh = useCallback(() => {
        refetchInventory();
    }, []);
    if (isLoading) {
        return <div className="spinner" />;
    }

    return <Col>
        <h2>{inventory?.title}</h2>
        <Tabs className="mb-3" fill>
            <Tab eventKey="items" title="Items">
                {inventory && <ItemPage inventory={inventory}/>}
            </Tab>
            <Tab eventKey='chat' title="Chat">
                Chat
            </Tab>
            <Tab eventKey="settings" title="Settings">
                <Container className="d-flex justify-content-center">
                    <Col md={6}>
                        <InventoryEditorForm
                            inventory={inventory}
                            onForceRefresh={onForceRefresh} />
                    </Col>
                </Container>
            </Tab>
            <Tab eventKey="customId" title="Custom ID">
                Custom ID
            </Tab>
            <Tab eventKey="fields" title="Fields">
                Fields
            </Tab>
        </Tabs>
    </Col>
}