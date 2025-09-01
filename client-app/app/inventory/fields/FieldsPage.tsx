import { useContext, useState } from "react";
import { Button, Col, Form, FormCheck, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import FieldEditorModal from "./FieldEditorModal";

export default function FieldsPage() {
    const { inventory } = useContext(InventoryContext);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const handleOnAddClick = () => {
        setCreateModalVisible(true);
    };
    const handleHideModal = () => {
        setCreateModalVisible(false);
    };

    const fields = inventory?.fields || [];
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
                    return <tr>
                        <td><FormCheck /></td>
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
                show={createModalVisible}
                onHide={handleHideModal} />
        )}
    </Col>;
}