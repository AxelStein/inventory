import { useGetAppConfigQuery } from "api/app/app.api";
import { useUpdateInventoryMutation } from "api/inventory/inventory.api";
import type { Inventory, InventoryField } from "api/inventory/inventory.types";
import { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

interface FieldEditorModalProps {
    inventory: Inventory;
    editField: InventoryField | null;
    show: boolean;
    onHide: () => void;
}

interface FieldEditorForm {
    name: string;
    description: string;
    type: string;
    state: string;
}

export default function FieldEditorModal({ show, onHide, inventory, editField }: FieldEditorModalProps) {
    const { data: appConfig } = useGetAppConfigQuery();
    const [updateInventory] = useUpdateInventoryMutation();
    const { register, handleSubmit } = useForm<FieldEditorForm>({defaultValues: {
        name: editField?.name,
        description: editField?.description ?? '',
        type: editField?.type,
        state: editField?.state,
    }});

    const onSubmit = useCallback((form: FieldEditorForm) => {
        const fields = inventory.fields?.map(({ uid, ...values }) => values) || [];
        if (!editField) {
            fields.push(form);
        }

        updateInventory({
            id: inventory.id,
            body: {
                fields: fields,
                version: inventory.version
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