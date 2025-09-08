import { Alert } from "react-bootstrap";
import { useErrorFormatter } from "./error.formatter";

interface ErrorAlertProps {
    error?: any;
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
    const { formatError } = useErrorFormatter();
    if (!error) return null;
    return <Alert variant="danger">{formatError(error)}</Alert>
}