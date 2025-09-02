import { useGetInventoryByIdQuery } from "api/inventory/inventory.api";
import React, { useCallback, useEffect, useState } from "react";
import InventoryEditorForm from "./components/InventoryEditorForm";
import { Col, Container, Tab, Tabs } from "react-bootstrap";
import ItemPage from "~/inventory/item/ItemPage";
import { type Inventory } from "api/inventory/inventory.types";
import FieldsPage from "./fields/FieldsPage";

export const InventoryContext = React.createContext<InventoryContextData>({});

interface InventoryContextData {
    inventory?: Inventory;
    setInventory?: (inventory: Inventory) => void;
}

interface InventoryPageProps {
    inventoryId: number;
}

export default function InventoryPage({ inventoryId }: InventoryPageProps) {
    const { data, refetch, isLoading } = useGetInventoryByIdQuery({ id: inventoryId, asGuest: true });
    const [inventory, setInventory] = useState<Inventory | undefined>();

    const onForceRefresh = useCallback(() => {
        refetch();
    }, []);

    useEffect(() => setInventory(data), [data]);

    if (isLoading || !inventory) {
        return <div className="spinner" />;
    }
    return <InventoryContext.Provider value={{ inventory, setInventory }}>
        <Col>
            <h2>{inventory?.title}</h2>
            <Tabs className="mb-3" fill>
                <Tab eventKey="items" title="Items">
                    {inventory && <ItemPage />}
                </Tab>
                <Tab eventKey='chat' title="Chat">
                    Chat
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    <Container className="d-flex justify-content-center">
                        <Col md={6}>
                            <InventoryEditorForm />
                        </Col>
                    </Container>
                </Tab>
                <Tab eventKey="customId" title="Custom ID">
                    Custom ID
                </Tab>
                <Tab eventKey="fields" title="Fields">
                    {inventory && <FieldsPage />}
                </Tab>
            </Tabs>
        </Col>
    </InventoryContext.Provider>;
}