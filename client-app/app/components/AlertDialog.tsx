import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface AlertDialogProps {
    title?: string;
    message?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function AlertDialog({ title, message, confirmLabel = 'OK', onConfirm, onCancel }: AlertDialogProps) {
    const { t } = useTranslation();
    return <Modal show={message != null} onHide={onCancel}>
        {title && (<Modal.Header>{title}</Modal.Header>)}
        {message && <Modal.Body>{message}</Modal.Body>}
        <Modal.Footer>
            <Button variant='secondary' onClick={onCancel}>{t('actions.cancel')}</Button>
            <Button variant='primary' onClick={onConfirm}>{confirmLabel}</Button>
        </Modal.Footer>
    </Modal>
}