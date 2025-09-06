import { InventoryFieldType, type Inventory, type InventoryField } from "api/inventory/inventory.types";
import { useCreateItemMutation, useDeleteItemMutation, useUpdateItemMutation } from "api/item/item.api";
import type { InventoryItem } from "api/item/item.types";
import { t } from "i18next";
import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import type { AsProp } from "react-bootstrap/esm/helpers";
import { useForm, type FormState, type RegisterOptions, type UseFormRegister } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";

interface ItemEditorModalProps {
    inventory: Inventory;
    fields: InventoryField[];
    editItem: InventoryItem | null;
    show: boolean;
    onHide: () => void;
    setItem: (item: InventoryItem | null) => void;
}

export default function ItemEditorModal({ inventory, show, editItem, fields, onHide, setItem }: ItemEditorModalProps) {
    const [createItem] = useCreateItemMutation();
    const [updateItem] = useUpdateItemMutation();
    const [deleteItem] = useDeleteItemMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState,
        setError: setFormError
    } = useForm<any>();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        const form: Record<string, any> = {};
        fields.forEach(f => {
            if (editItem && f.uid in editItem) {
                form[f.uid] = editItem[f.uid as keyof InventoryItem];
            } else {
                form[f.uid] = '';
            }
        })
        reset(form);
    }, [show, fields, editItem]);

    const handleError = (err: any) => {
        if (!err.data) {
            setErrorMessage('Network error');
            return;
        }
        const details = err.data?.details;
        if (!details) {
            setErrorMessage(err.data?.message);
            return;
        }
        Object.keys(details).forEach((key) => {
            setFormError(key, { message: details[key] });
        });
    }

    const handleFormChange = () => {
        setErrorMessage(undefined);
    }

    const onSubmit = (values: any) => {
        values.inventoryId = inventory.id;
        values.inventoryVersion = inventory.version;

        if (editItem) {
            values.itemId = editItem.id;
            values.version = editItem.version;
            updateItem(values)
                .unwrap()
                .then(setItem)
                .catch(handleError);
        } else {
            createItem(values)
                .unwrap()
                .then(setItem)
                .catch(handleError);
        }
    }

    const handleDelete = () => {
        deleteItem(editItem!.id)
            .unwrap()
            .then(() => {
                setItem(null);
            })
            .catch(err => console.log(err));
    }

    return <Modal show={show} onHide={onHide}>
        <Modal.Header>{editItem != null ? 'Edit' : 'Add'} item</Modal.Header>
        <Modal.Body>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                onChange={handleFormChange}>

                {fields.map(field => createFormItem(field, register, formState))}

                <div className="validation-error-message">{errorMessage}</div>

                <div className="d-flex justify-content-between">
                    {editItem != null ? (
                        <Button variant='outline-danger' onClick={handleDelete}>
                            <MdDeleteOutline />
                        </Button>
                    ) : (<span></span>)}

                    <Button
                        className="btn btn-primary"
                        type='submit'>
                        {editItem != null ? 'Save' : 'Add'}
                    </Button>
                </div>
            </Form>

        </Modal.Body>
    </Modal>;
}

function createFormItem(
    field: InventoryField,
    register: UseFormRegister<any>,
    formState: FormState<any>
): ReactNode {
    const err = formState.errors[field.uid]?.message?.toString();

    let type = 'text';
    let placeholder = field.name ?? '';
    let options = { required: true } as RegisterOptions | undefined;
    let asTextArea = false;

    switch (field.type) {
        case InventoryFieldType.customId:
            placeholder = 'ID (leave empty to autogenerate)';
            options = undefined;
            break;

        case InventoryFieldType.text:
            asTextArea = true;
            break;

        case InventoryFieldType.int:
            options!.valueAsNumber = true;
            type = 'number';
            break;

        case InventoryFieldType.boolean:
            return <>
                <Form.Switch
                    label={field.name}
                    className='mb-3'
                    isInvalid={err != null}
                    {...register(field.uid, {
                        setValueAs: (value) => (value === 'on')
                    })} />
                <Form.Control.Feedback type='invalid'>{err}</Form.Control.Feedback>
            </>
    }

    return <Form.Group>
        <Form.Control
            type={type}
            as={asTextArea ? 'textarea' : undefined}
            placeholder={placeholder}
            className='mb-3'
            isInvalid={err != null}
            {...register(field.uid, options)} />
        <Form.Control.Feedback type='invalid'>{err}</Form.Control.Feedback>
    </Form.Group>
}
