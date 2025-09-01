import type { Inventory, InventoryField } from "api/inventory/inventory.types";
import { useCreateItemMutation } from "api/item/item.api";
import { t } from "i18next";
import type { ReactNode } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm, type UseFormRegister } from "react-hook-form";

interface ItemEditorModalProps {
    inventory: Inventory;
    fields: InventoryField[];
    show: boolean;
    onHide: () => void;
}

export default function ItemEditorModal({ inventory, show, fields, onHide }: ItemEditorModalProps) {
    const [createItem] = useCreateItemMutation();
    const onSubmit = (values: any) => {
        values.inventoryId = inventory.id;
        values.inventoryVersion = inventory.version;
        createItem(values)
            .unwrap()
            .then(item => console.log(item))
            .catch(err => console.log(err))
    }
    const { register, handleSubmit } = useForm<any>();
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>Create item</Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {fields.map(field => createFormItem(field, register))}

                <Button
                    className="btn btn-primary"
                    type='submit'>
                    Save
                </Button>
            </Form>
        </Modal.Body>
    </Modal>;
}

function createFormItem(field: InventoryField, register: UseFormRegister<any>): ReactNode {
    switch (field.type) {
        case 'string':
            return <Form.Control
                type="text"
                placeholder={field.name ?? ""}
                className='mb-3'
                {...register(field.uid)} />;

        case 'text':
            return <Form.Control
                as='textarea'
                placeholder={field.name ?? ""}
                className='mb-3'
                rows={6}
                {...register(field.uid)} />;

        case 'int':
            return <Form.Control
                type="number"
                placeholder={field.name ?? ""}
                className='mb-3'
                {...register(field.uid)} />;

        case 'link':
            return <Form.Control
                type="text"
                placeholder={field.name ?? ""}
                className='mb-3'
                {...register(field.uid)} />;

        case 'boolean':
            return <Form.Switch
                label={field.name}
                className='mb-3'
                {...register(field.uid)} />;
    }
}
