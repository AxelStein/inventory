import type { InventoryField } from "api/inventory/inventory.types";
import { useGetItemsQuery } from "api/item/item.api";
import type { InventoryItem } from "api/item/item.types";
import { useContext, useState } from "react";
import { Button, Col, FormCheck, Table } from "react-bootstrap";
import { InventoryContext } from "../InventoryPage";
import { MdAdd, MdCheckBox, MdCheckBoxOutlineBlank, MdDeleteOutline } from "react-icons/md";
import ItemEditorModal from "./ItemEditorModal";
import { isGuest } from "~/auth/auth.check.guest";

export default function ItemPage() {
    const { inventory } = useContext(InventoryContext);
    const { data, isLoading } = useGetItemsQuery({ inventoryId: inventory!.id, asGuest: isGuest() });
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

    const fields = inventory!.fields?.filter(f => f.state == 'visible') || [];
    fields.unshift({
        uid: "customId",
        name: "ID",
        state: "visible",
        type: "customId"
    });

    const canAdd = inventory!.permissions?.item?.create == true;
    const canDelete = inventory!.permissions?.item?.delete == true;

    return <Col>
        {(canAdd || canDelete) && (
            <div className="mb-3">
                {canAdd && (
                    <Button variant='outline-primary' className='me-2' onClick={handleOnAddClick}>
                        <MdAdd /> Add
                    </Button>
                )}
            </div>
        )}
        <Table hover responsive>
            <thead>
                <tr>
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
        {
            fields.map(field => {
                const value = (item as any)[field.uid];
                if (field.type === 'boolean') {
                    return <td>{value ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}</td>;
                }
                return <td>{value}</td>;
            })
        }
    </tr>;
}