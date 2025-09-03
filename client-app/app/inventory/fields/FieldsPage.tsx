import { useContext, useState } from "react";
import { Button, Col, Form, FormCheck, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import FieldEditorModal from "./FieldEditorModal";
import type { InventoryField } from "api/inventory/inventory.types";

export default function FieldsPage() {
    const { inventory } = useContext(InventoryContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [editField, setEditField] = useState<InventoryField | null>(null);

    const handleOnAddClick = () => {
        setEditField(null);
        setModalVisible(true);
    };
    const handleHideModal = () => {
        setModalVisible(false);
    };
    const handleFieldClick = (event: any, field: InventoryField) => {
        const target = event.target as Element;
        if (!target.closest('.no-row-click')) {
            setEditField(field);
            setModalVisible(true);
        }
    }

    const fields = inventory!.fields || [];
    const canEdit = inventory?.permissions?.inventory?.update === true;
    if (!canEdit) {
        return <p>You have not access to edit inventory fields</p>;
    }
    return <Col>
        <div className="mb-3">
            <Button
                variant='outline-primary'
                className='me-2'
                onClick={handleOnAddClick}>
                <MdAdd /> Add
            </Button>
            <Button variant='outline-danger'>
                <MdDeleteOutline />
            </Button>
        </div>
        <Table hover responsive>
            <thead>
                <tr>
                    <th><FormCheck /></th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>State</th>
                </tr>
            </thead>
            <tbody>
                {fields.map((field) => {
                    return <tr onClick={(event) => handleFieldClick(event, field)}>
                        <td className="no-row-click"><FormCheck /></td>
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