import { useGetAppConfigQuery } from "api/app/app.api";
import { useUpdateInventoryMutation } from "api/inventory/inventory.api";
import type { Inventory } from "api/inventory/inventory.types";
import { Button, Form, Modal } from "react-bootstrap";

interface FieldEditorModalProps {
    inventory: Inventory;
    show: boolean;
    onHide: () => void;
}

export default function FieldEditorModal({ show, onHide, inventory }: FieldEditorModalProps) {
    const { data: appConfig } = useGetAppConfigQuery();
    const [updateInventory] = useUpdateInventoryMutation();

    if (!appConfig) {
        return <div className="spinner" />;
    }
    const config = appConfig.inventory.customField;
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>Add field</Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Name" />
                <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Description" />
                <Form.Select className="mb-3">
                    {config.types.map((type) => (<option value={type}>{type}</option>))}
                </Form.Select>
                <Form.Select className="mb-3">
                    {config.states.map((state) => (<option value={state}>{state}</option>))}
                </Form.Select>
                <Button
                    className="btn btn-primary"
                    type='submit'>
                    Add
                </Button>
            </Form>
        </Modal.Body>
    </Modal>;
}