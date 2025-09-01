import type { InventoryField } from "api/inventory/inventory.types";
import { useGetItemsQuery } from "api/item/item.api";
import type { InventoryItem } from "api/item/item.types";
import { useContext, useState } from "react";
import { Button, Col, FormCheck, Modal, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd, MdCheck, MdCheckBox, MdCheckBoxOutlineBlank, MdDeleteOutline, MdOutlineCheckBox } from "react-icons/md";
import ItemEditorModal from "./ItemEditorModal";

export default function ItemPage() {
    const { inventory } = useContext(InventoryContext);
    const { data, isLoading } = useGetItemsQuery({ inventoryId: inventory?.id ?? 0 }, { skip: !inventory });

    const fields = inventory?.fields?.filter(f => f.state == 'visible') || [];
    fields.unshift({
        uid: "customId",
        name: "ID",
        state: "visible",
        type: "customId"
    });
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const handleOnAddClick = () => {
        setCreateModalVisible(true);
    };
    const handleHideModal = () => {
        setCreateModalVisible(false);
    };

    if (!data || isLoading) {
        return <div className="spinner" />;
    }
    return <Col>
        <div className="mb-3">
            <Button variant='outline-primary' className='me-2' onClick={handleOnAddClick}>
                <MdAdd />
            </Button>
            <Button variant='outline-danger'>
                <MdDeleteOutline />
            </Button>
        </div>
        <Table hover responsive>
            <thead>
                <tr>
                    <th><FormCheck/></th>
                    {fields.map(createColumn)}
                </tr>
            </thead>
            <tbody>
                {data.items.map(item => createRow(item, fields))}
            </tbody>
        </Table>
        {inventory && (
            <ItemEditorModal
                inventory={inventory}
                show={createModalVisible}
                fields={fields}
                onHide={handleHideModal} />
        )}
    </Col>
}

function createColumn(field: InventoryField) {
    return <th>{field.name}</th>;
}

function createRow(item: InventoryItem, fields: InventoryField[]) {
    return <tr>
        <th><FormCheck/></th>
        {
            fields.map(field => {
                const value = (item as any)[field.uid];
                if (field.type === 'boolean') {
                    return <td>{value ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/>}</td>;
                }
                return <td>{value}</td>;
            })
        }
    </tr>;
}