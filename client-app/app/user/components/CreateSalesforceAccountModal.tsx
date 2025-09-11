import { useCreateAccountMutation } from "api/salesforce/salesforce.api";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";

interface AccountFormValues {
    name: string;
    phone: string;
    industry: string;
    website: string;
}

interface ContactFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface SalesforceAccountModalProps {
    show: boolean;
    onHide: () => void;
}

const MAX_CONTACT_COUNT = 5;

export default function CreateSalesforceAccountModal({ show, onHide }: SalesforceAccountModalProps) {
    const [account, setAccount] = useState<AccountFormValues>({
        name: '',
        phone: '',
        website: '',
        industry: ''
    });
    const [contacts, setContacts] = useState<ContactFormValues[]>([]);
    const [createAccount] = useCreateAccountMutation();

    const handleAddContact = () => {
        setContacts([
            ...contacts,
            {
                firstName: '',
                lastName: '',
                email: '',
                phone: ''
            }
        ]);
    }

    const handleDeleteContact = (index: number) => {
        const arr = [...contacts];
        arr.splice(index, 1);
        setContacts(arr);
    }

    const handleCreateAccount = () => {
        console.log(account, contacts);
        createAccount({
            ...account,
            contacts: contacts.map(contact => ({...contact}))
        });
    }

    useEffect(() => {
        if (!show) {
            setContacts([]);
            setAccount({
                name: '',
                phone: '',
                website: '',
                industry: ''
            });
        }
    }, [show]);

    return <Modal show={show} onHide={onHide}>
        <Modal.Header>Create Salesforce Account</Modal.Header>
        <Modal.Body>
            <div>
                <h4>Account</h4>
                <AccountForm account={account} />

                <h4>Contacts</h4>
                <ol>
                    {contacts?.map((contact, i) => (
                        <li>
                            <ContactForm
                                contact={contact}
                                onDeleteClick={() => handleDeleteContact(i)} />
                        </li>
                    ))}
                </ol>

                {contacts.length < MAX_CONTACT_COUNT && (
                    <div
                        className="d-flex justify-content-center">
                        <Button variant="secondary" onClick={handleAddContact}>Add contact</Button>
                    </div>
                )}

                <hr />

                <div className="d-flex align-content-right">
                    <Button onClick={handleCreateAccount}>
                        Create
                    </Button>
                </div>

            </div>

        </Modal.Body>
    </Modal>
}

interface AccountFormProps {
    account: AccountFormValues;
}

function AccountForm({ account }: AccountFormProps) {
    const { register, getValues, reset } = useForm<AccountFormValues>();

    const handleChange = () => {
        const values = getValues();
        account.industry = values.industry;
        account.name = values.name;
        account.phone = values.phone;
        account.website = values.website;
    }

    useEffect(() => {
        reset(account);
    }, [account]);

    return <Form onChange={handleChange}>
        <Form.Group>
            <Form.Control
                className="mb-3"
                type="text"
                placeholder="Name"
                {...register('name')} />
            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
            <Form.Control
                className="mb-3"
                type="tel"
                placeholder="Phone"
                {...register('phone')} />
            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
            <Form.Control
                className="mb-3"
                type="text"
                placeholder="Industry"
                {...register('industry')} />
            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
            <Form.Control
                className="mb-5"
                type="url"
                placeholder="Website"
                {...register('website')} />
            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
        </Form.Group>

    </Form>
}

interface ContactFormProps {
    contact: ContactFormValues;
    onDeleteClick: () => void;
}

function ContactForm({ contact, onDeleteClick }: ContactFormProps) {
    const { register, getValues, reset } = useForm<ContactFormValues>({
        defaultValues: contact
    });
    useEffect(() => {
        reset(contact);
    }, [contact]);

    const handleChange = () => {
        const f = getValues();
        contact.firstName = f.firstName;
        contact.lastName = f.lastName;
        contact.email = f.email;
        contact.phone = f.phone;
    }

    return <>
        <Form onChange={handleChange}>
            <div className="d-flex mb-3 align-items-center">
                <div className="me-2">
                    <div className="d-flex mb-2">
                        <Form.Group className="me-2">
                            <Form.Control
                                type="text"
                                placeholder="First name"
                                {...register('firstName')} />
                            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Last name"
                                {...register('lastName')} />
                            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    <div className="d-flex">
                        <Form.Group className="me-2">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                {...register('email')} />
                            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control
                                type="tel"
                                placeholder="Phone"
                                {...register('phone')} />
                            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>

                <Button
                    variant='outline-danger'
                    onClick={onDeleteClick}>
                    <MdDeleteOutline />
                </Button>
            </div>

        </Form>

    </>
}