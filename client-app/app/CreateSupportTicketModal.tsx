import { useGetAppConfigQuery } from "api/app/app.api";
import { useCreateSupportTicketMutation } from "api/support/support.api";
import type { CreateSupportTicketProps } from "api/support/support.types";
import { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useErrorFormatter } from "./components/error.formatter";
import { toast } from "react-toastify";

interface CreateSupportTicketModalProps {
    show: boolean;
    onHide: () => void;
}

interface TicketForm {
    priority: string;
    summary: string;
}

export default function CreateSupportTicketModal({ show, onHide }: CreateSupportTicketModalProps) {
    const [createTicket, { isLoading: isSubmit }] = useCreateSupportTicketMutation();
    const { data: appConfig } = useGetAppConfigQuery();
    const { formatError } = useErrorFormatter();

    const { register, reset, handleSubmit, setError, formState } = useForm<TicketForm>();

    const handleError = (err: any) => {
        if (!err.data) {
            toast.error(formatError(err));
            return;
        }

        const data = JSON.parse(err.data);
        const details = data.details;
        if (!details) {
            toast.error(data.message);
            return;
        }

        Object.keys(details).forEach(key => setError(
            key as keyof TicketForm,
            { message: details[key] })
        );
    }

    const handleCreateTicket = (data: TicketForm) => {
        const currentUrl = window.location.origin + location.pathname;
        const route = location.pathname.split('/')[1];
        const id = location.pathname.split('/')[2];

        const body: CreateSupportTicketProps = {
            link: currentUrl,
            ...data
        };
        if (route === 'inventory') {
            body.inventoryId = Number(id);
        }
        createTicket(body)
            .unwrap()
            .then(onHide)
            .catch(handleError);
    }

    useEffect(() => {
        reset({ priority: 'average', summary: '' });
    }, [show]);

    if (!appConfig) {
        return null;
    }

    const summaryError = formState.errors?.summary?.message;
    const priorityError = formState.errors?.priority?.message;

    return <Modal show={show} onHide={onHide}>
        <Modal.Header>Create support ticket</Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(handleCreateTicket)}>
                <Form.Group
                    className="mb-3">
                    <Form.Control
                        as='textarea'
                        rows={8}
                        isInvalid={summaryError != null}
                        placeholder="Summary"
                        {...register('summary')} />
                    <Form.Control.Feedback type="invalid">{summaryError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                    className='mb-3'>
                    <Form.Select
                        isInvalid={priorityError != null}
                        {...register('priority')}>

                        {appConfig?.supportTicketPriority?.map((priority) => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">{priorityError}</Form.Control.Feedback>
                </Form.Group>

                <Button
                    className='w-100 mb-3'
                    variant='outline-primary'
                    type='submit'
                    disabled={isSubmit}>
                    {isSubmit ? '...' : 'Create'}
                </Button>
            </Form>
        </Modal.Body>
    </Modal >
}