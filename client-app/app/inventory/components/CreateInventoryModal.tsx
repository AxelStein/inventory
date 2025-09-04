import { Modal } from "react-bootstrap";
import type { BaseModalProps } from "@restart/ui/Modal";
import InventoryEditorForm from "~/inventory/components/InventoryEditorForm";
import type { Inventory } from "api/inventory/inventory.types";
import { useTranslation } from "react-i18next";

interface CreateInventoryModalProps extends BaseModalProps {
    show: boolean,
    onHide: () => void,
}

export default function CreateInventoryModal({ show, onHide }: CreateInventoryModalProps) {
    const { t } = useTranslation();
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>
            {t('inventory.createModal.title')}
        </Modal.Header>
        <Modal.Body>
            <InventoryEditorForm/>
        </Modal.Body>
    </Modal>
}