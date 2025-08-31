import { Modal } from "react-bootstrap";
import type { BaseModalProps } from "@restart/ui/Modal";
import InventoryEditorForm from "~/inventory/components/InventoryEditorForm";
import type { Inventory } from "api/inventory/inventory.types";
import { useTranslation } from "react-i18next";

interface CreateInventoryModalProps extends BaseModalProps {
    show: boolean,
    onHide: () => void,
    onChanged: (inventory: Inventory) => void,
}

export default function CreateInventoryModal({ show, onHide, onChanged }: CreateInventoryModalProps) {
    const { t } = useTranslation();
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>
            <Modal.Title>{t('inventory.createModal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InventoryEditorForm/>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
    </Modal>
}