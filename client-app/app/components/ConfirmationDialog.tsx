import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface ConfirmationDialogProps {
    message: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

type ConfirmationDialogCallback = () => void;

export function ConfirmationDialog({ message, onConfirm, onCancel }: ConfirmationDialogProps) {
    return <Modal show={message != null} onHide={onCancel}>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={onCancel}>Cancel</Button>
            <Button variant='primary' onClick={onConfirm}>OK</Button>
        </Modal.Footer>
    </Modal>
}

export function useConfirmationDialog() {
    const [message, setMessage] = useState<string | null>(null);
    const [onConfirm, setOnConfirm] = useState<ConfirmationDialogCallback | null>(null);
    const showConfirmationDialog = (message: string, onConfirm: () => void) => {
        setMessage(message);
        setOnConfirm(() => onConfirm);
    };
    const onDialogConfirm = () => {
        if (onConfirm != null) {
            onConfirm();
        }
        setMessage(null);
    };
    const onDialogCancel = () => {
        setMessage(null);
    };
    return { confirmationDialogMessage: message, showConfirmationDialog, onDialogConfirm, onDialogCancel };
}