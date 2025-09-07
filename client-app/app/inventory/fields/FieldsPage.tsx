import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, FormCheck, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import FieldEditorModal from "./FieldEditorModal";
import type { InventoryField } from "api/inventory/inventory.types";
import { useTranslation } from "react-i18next";

export default function FieldsPage() {
    const { t } = useTranslation();
    const { inventory } = useContext(InventoryContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [editField, setEditField] = useState<InventoryField | null>(null);

    useEffect(() => setModalVisible(false), [inventory]);

    const handleOnAddClick = () => {
        setEditField(null);
        setModalVisible(true);
    };
    const handleHideModal = () => {
        setModalVisible(false);
    };
    const handleFieldClick = (field: InventoryField) => {
        setEditField(field);
        setModalVisible(true);
    }

    const fields = inventory!.fields || [];
    const canEdit = inventory?.permissions?.inventory?.update === true;
    if (!canEdit) {
        return <Alert>You have not access to edit inventory fields</Alert>;
    }
    return <Col>
        <div className="mb-3">
            <Button
                variant='outline-primary'
                className='me-2'
                onClick={handleOnAddClick}>
                <MdAdd /> {t('general.btnAdd')}
            </Button>
        </div>
        <Table hover responsive>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>State</th>
                </tr>
            </thead>
            <tbody>
                {fields.map((field) => {
                    return <tr onClick={() => handleFieldClick(field)}>
                        <td>{field.name}</td>
                        <td>{field.description}</td>
                        <td>{field.type}</td>
                        <td>{field.state}</td>
                    </tr>
                })}
            </tbody>
        </Table>

        {inventory && (
            <FieldEditorModal
                inventory={inventory}
                editField={editField}
                show={modalVisible}
                onHide={handleHideModal} />
        )}
    </Col>;
}