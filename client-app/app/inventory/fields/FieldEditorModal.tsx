import { useGetAppConfigQuery } from "api/app/app.api";
import { useUpdateInventoryMutation } from "api/inventory/inventory.api";
import type { Inventory, InventoryField } from "api/inventory/inventory.types";
import { useContext, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { InventoryContext } from "../InventoryPage";
import Loader from "~/components/Loader";
import { useTranslation } from "react-i18next";
import ErrorAlert from "~/components/ErrorAlert";

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
    const { data: appConfig, isLoading: isLoadingAppConfig, error: errorAppConfig } = useGetAppConfigQuery();
    const [updateInventory] = useUpdateInventoryMutation();
    const { register, handleSubmit, reset: resetForm } = useForm<FieldEditorForm>();
    const { setInventory, handleInventoryError } = useContext(InventoryContext);
    const { t } = useTranslation();

    const config = appConfig?.inventory.customField;

    useEffect(() => {
        resetForm({
            name: editField?.name ?? '',
            description: editField?.description ?? '',
            type: editField?.type ?? config?.types[0] ?? '',
            state: editField?.state ?? config?.states[0] ?? '',
        });
    }, [show, config, editField, resetForm]);

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

    if (isLoadingAppConfig) {
        return <Loader />;
    }
    if (errorAppConfig) {
        return <ErrorAlert error={errorAppConfig} />;
    }
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>{t(editField != null ? 'customId.titleEditField' : 'customId.titleAddField')}</Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder={t('customId.tableColumns.name')}
                    {...register('name', { required: true })} />

                <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder={t('customId.tableColumns.description')}
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
                        {t(editField != null ? 'actions.save' : 'actions.add')}
                    </Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>;
}