import {Button} from "react-bootstrap";
import {MdAdd, MdDeleteOutline} from "react-icons/md";
import {useState} from "react";
import CreateInventoryModal from "~/inventory/components/CreateInventoryModal";
import type { Inventory } from "api/inventory/inventory.types";

export default function UserInventoryToolbar() {
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => setCreateModalVisible(false);
    const onInventoryCreated = (inventory: Inventory) => {
        hideCreateModal();
    };

    return <div className='mb-3'>
        <Button variant='outline-primary' className='me-2' onClick={showCreateModal}>
            <MdAdd />
        </Button>
        <Button variant='outline-danger'>
            <MdDeleteOutline />
        </Button>

        <CreateInventoryModal
            show={createModalVisible}
            onHide={hideCreateModal}
            onCreated={onInventoryCreated}/>
    </div>;
}