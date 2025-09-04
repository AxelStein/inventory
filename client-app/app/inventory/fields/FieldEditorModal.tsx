import { useGetAppConfigQuery } from "api/app/app.api";
import { useUpdateInventoryMutation } from "api/inventory/inventory.api";
import type { Inventory, InventoryField } from "api/inventory/inventory.types";
import { useCallback, useContext, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { InventoryContext } from "../InventoryPage";

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
    const { register, handleSubmit, reset: resetForm } = useForm<FieldEditorForm>();
    const { setInventory, handleInventoryError } = useContext(InventoryContext);

    const config = appConfig?.inventory.customField;

    useEffect(() => {
        resetForm({
            name: editField?.name ?? '',
            description: editField?.description ?? '',
            type: editField?.type ?? config?.types[0] ?? '',
            state: editField?.state ?? config?.states[0] ?? '',
        });
    }, [config, editField, resetForm]);

    const updateFields = (fields: FieldEditorForm[]) => {
        updateInventory({
            id: inventory.id,
            body: {
                fields: fields,
                version: inventory.version
            }
        }).unwrap()
            .then(setInventory)
            .catch(handleInventoryError);
    }

    const onSubmit = (form: FieldEditorForm) => {
        const fields = inventory.fields?.map(({ uid, ...values }) => {
            return uid === editField?.uid ? form : values as FieldEditorForm;
        }) || [];
        if (!editField) {
            fields.push(form);
        }
        updateFields(fields);
    }
    const handleDelete = () => {
        if (editField) {
            updateFields(
                inventory.fields
                    ?.filter(f => f.uid !== editField.uid)
                    .map(({ uid, ...values }) => (values as FieldEditorForm))
                || []
            );
        }
    }

    if (!appConfig) {
        return <div className="spinner" />;
    }
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>{editField != null ? 'Edit' : 'Add'} field</Modal.Header>
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
                    {config?.types.map((type) => (<option value={type}>{type}</option>))}
                </Form.Select>

                <Form.Select
                    className="mb-3"
                    {...register('state', { required: true })}>
                    {config?.states.map((state) => (<option value={state}>{state}</option>))}
                </Form.Select>

                <div className="d-flex justify-content-between">
                    {editField != null ? (
                        <Button variant='outline-danger' onClick={handleDelete}>
                            <MdDeleteOutline />
                        </Button>
                    ) : (<span></span>)}

                    <Button
                        className="btn btn-primary"
                        type='submit'>
                        {editField != null ? 'Save' : 'Add'}
                    </Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>;
}