import { useContext, useEffect, useState } from "react";
import { Button, Col, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd } from "react-icons/md";
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
    return <Col>
        <div className="mb-3">
            <Button
                variant='outline-primary'
                className='me-2'
                onClick={handleOnAddClick}>
                <MdAdd /> {t('actions.add')}
            </Button>
        </div>
        <Table hover responsive>
            <thead>
                <tr>
                    <th>{t('customId.tableColumns.name')}</th>
                    <th>{t('customId.tableColumns.description')}</th>
                    <th>{t('customId.tableColumns.type')}</th>
                    <th>{t('customId.tableColumns.state')}</th>
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