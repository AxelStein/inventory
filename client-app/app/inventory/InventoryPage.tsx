import { useGetInventoryByIdQuery } from "api/inventory/inventory.api";
import React, { useCallback, useEffect, useState } from "react";
import InventoryEditorForm from "./components/InventoryEditorForm";
import { Col, Container, Tab, Tabs } from "react-bootstrap";
import ItemPage from "~/inventory/item/ItemPage";
import { type Inventory } from "api/inventory/inventory.types";
import FieldsPage from "./fields/FieldsPage";
import { isGuest } from "~/auth/auth.check.guest";
import CustomIdPage from "./custom_id/CustomIdPage";
import { toast } from 'react-toastify';
import AppToastContainer from "~/components/AppToastContainer";
import { useTranslation } from "react-i18next";

export const InventoryContext = React.createContext<InventoryContextData>({});

interface InventoryContextData {
    inventory?: Inventory;
    setInventory?: (inventory: Inventory) => void;
    handleInventoryError?: (err: any) => void;
}

interface InventoryPageProps {
    inventoryId: number;
}

export default function InventoryPage({ inventoryId }: InventoryPageProps) {
    const { data, refetch, isLoading } = useGetInventoryByIdQuery({ id: inventoryId, asGuest: isGuest() });
    const [inventory, setInventory] = useState<Inventory | undefined>();
    const { t } = useTranslation();

    const handleInventoryError = (err: any) => {
        if (err.status === 409) {
            refetch();
        } else {
            toast.error(err.data ? err.data.message : t('networkError'));
        }
    }

    useEffect(() => setInventory(data), [data]);

    if (isLoading || !inventory) {
        return <div className="spinner" />;
    }

    const canEditInventory = inventory.permissions?.inventory?.update == true;

    return <InventoryContext.Provider value={{ inventory, setInventory, handleInventoryError }}>
        <Col>
            <h2 className="mb-4">{inventory.title}</h2>
            <Tabs className="mb-3" fill>
                <Tab eventKey="items" title={t('inventory.tabs.items')}>
                    <ItemPage />
                </Tab>
                {canEditInventory && [
                    <Tab eventKey="settings" title={t('inventory.tabs.settings')}>
                        <Container className="d-flex justify-content-center">
                            <Col md={6}>
                                <InventoryEditorForm />
                            </Col>
                        </Container>
                    </Tab>,
                    <Tab eventKey="customId" title={t('inventory.tabs.customId')}>
                        <CustomIdPage />
                    </Tab>,
                    <Tab eventKey="fields" title={t('inventory.tabs.fields')}>
                        <FieldsPage />
                    </Tab>
                ]}
            </Tabs>
            <AppToastContainer />
        </Col>
    </InventoryContext.Provider>;
}