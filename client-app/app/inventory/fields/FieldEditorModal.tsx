import { useGetAppConfigQuery } from "api/app/app.api";
import { useUpdateInventoryMutation } from "api/inventory/inventory.api";
import type { Inventory } from "api/inventory/inventory.types";
import { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

interface FieldEditorModalProps {
    inventory: Inventory;
    show: boolean;
    onHide: () => void;
}

interface FieldEditorForm {
    name: string;
    description: string;
    type: string;
    state: string;
}

export default function FieldEditorModal({ show, onHide, inventory }: FieldEditorModalProps) {
    const { data: appConfig } = useGetAppConfigQuery();
    const [updateInventory] = useUpdateInventoryMutation();
    const { register, handleSubmit } = useForm();

    const onSubmit = useCallback(() => {
        const fields = inventory.fields;
        updateInventory({ 
            id: inventory.id, 
            body: { 
                fields: inventory.fields 
            } 
        });
    }, []);

    if (!appConfig) {
        return <div className="spinner" />;
    }
    const config = appConfig.inventory.customField;
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>Add field</Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Name"
                    {...register('name', { required: true })} />

                <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Description"
                    {...register('description')} />

                <Form.Select
                    className="mb-3"
                    {...register('type', { required: true })}>
                    {config.types.map((type) => (<option value={type}>{type}</option>))}
                </Form.Select>

                <Form.Select
                    className="mb-3"
                    {...register('state', { required: true })}>
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