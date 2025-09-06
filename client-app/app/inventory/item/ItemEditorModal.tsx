import { InventoryFieldType, type Inventory, type InventoryField } from "api/inventory/inventory.types";
import { useCreateItemMutation, useDeleteItemMutation, useUpdateItemMutation } from "api/item/item.api";
import type { InventoryItem } from "api/item/item.types";
import { t } from "i18next";
import { useEffect, type ReactNode } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm, type UseFormRegister } from "react-hook-form";
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
    const { register, handleSubmit, reset } = useForm<any>();

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

    const onSubmit = (values: any) => {
        values.inventoryId = inventory.id;
        values.inventoryVersion = inventory.version;

        if (editItem) {
            values.itemId = editItem.id;
            values.version = editItem.version;
            updateItem(values)
                .unwrap()
                .then(setItem)
                .catch(err => console.log(err));
        } else {
            createItem(values)
                .unwrap()
                .then(setItem)
                .catch(err => console.log(err));
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
            <Form onSubmit={handleSubmit(onSubmit)}>
                {fields.map(field => createFormItem(field, register))}

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

function createFormItem(field: InventoryField, register: UseFormRegister<any>): ReactNode {
    switch (field.type) {
        case InventoryFieldType.customId:
            return <Form.Control
                type="text"
                placeholder='ID (leave empty to autogenerate)'
                className='mb-3'
                {...register(field.uid)} />;

        case InventoryFieldType.string:
            return <Form.Control
                type="text"
                placeholder={field.name ?? ""}
                className='mb-3'
                {...register(field.uid)} />;

        case InventoryFieldType.text:
            return <Form.Control
                as='textarea'
                placeholder={field.name ?? ""}
                className='mb-3'
                rows={6}
                {...register(field.uid)} />;

        case InventoryFieldType.int:
            return <Form.Control
                type="number"
                placeholder={field.name ?? ""}
                className='mb-3'
                {...register(field.uid, { valueAsNumber: true })} />;

        case InventoryFieldType.link:
            return <Form.Control
                type="text"
                placeholder={field.name ?? ""}
                className='mb-3'
                {...register(field.uid)} />;

        case InventoryFieldType.boolean:
            return <Form.Switch
                label={field.name}
                className='mb-3'
                {...register(field.uid, {
                    setValueAs: (value) => (value === 'on')
                })} />;
    }
}
