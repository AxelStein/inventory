import { Modal } from "react-bootstrap";
import type { BaseModalProps } from "@restart/ui/Modal";
import { useGetInventoryByIdQuery } from "../../../api/inventory/inventory.api";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import type { Inventory } from "../../../api/types";
import InventoryEditorForm from "~/inventory/components/InventoryEditorForm";

interface CreateInventoryModalProps extends BaseModalProps {
    show: boolean,
    onHide: () => void,
    onCreated: (inventory: Inventory) => void,
}

export default function CreateInventoryModal({ show, onHide, onCreated }: CreateInventoryModalProps) {
    const { data: inventory } = useGetInventoryByIdQuery(10);

    return <Modal show={show} onHide={onHide}>
        <Modal.Header>
            <Modal.Title>Create Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InventoryEditorForm inventory={inventory}/>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
    </Modal>
}