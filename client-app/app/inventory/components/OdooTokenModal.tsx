import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { MdCheck } from "react-icons/md";

interface OdooTokenModalProps {
    show: boolean;
    onHide: () => void;
    token?: string | null;
}

export default function OdooTokenModal({ show, onHide, token }: OdooTokenModalProps) {
    if (!token) {
        return null;
    }
    const [copied, setCopied] = useState(false);
    const handleCopyClick = () => {
        navigator.clipboard.writeText(token)
            .then(() => {
                setCopied(true);
            })
    }
    useEffect(() => {
        setCopied(false);
    }, [show]);
    return <Modal show={show} onHide={onHide}>
        <Modal.Header>Odoo token</Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control
                    className="mb-3"
                    readOnly={true} value={token} />
                {copied ? (
                    <p><MdCheck color="#009688"/> Copied</p>
                ) : (
                    <Button
                        onClick={handleCopyClick}>Copy</Button>
                )}
            </Form>
        </Modal.Body>
    </Modal >
}