import { useCreateAccountMutation } from "api/salesforce/salesforce.api";
import type { SalesforceAccount, SalesforceContact } from "api/salesforce/salesforce.types";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useFieldArray, useForm, type UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { useErrorFormatter } from "~/components/error.formatter";

const MAX_CONTACT_COUNT = 3;

interface AccountFormValue {
    name: string;
    phone: string;
    industry: string;
    website: string;
}

interface ContactFormValue {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ContactFormValues {
    contacts: ContactFormValue[];
}

interface SalesforceAccountModalProps {
    userId: number;
    account?: SalesforceAccount;
    onCreateAccount?: (account: SalesforceAccount) => void;
    show: boolean;
    onHide: () => void;
}

export default function CreateSalesforceAccountModal({ userId, account, onCreateAccount, show, onHide }: SalesforceAccountModalProps) {
    const {
        register: registerAccountForm,
        getValues: getAccountFormValues,
        reset: resetAccountForm,
        formState: accountFormState,
        setError: setAccountFormError
    } = useForm<AccountFormValue>({
        mode: 'onChange'
    });

    const {
        control,
        register: registerContactForm,
        formState: contactsFormState,
        setError: setContactFormError,
        getValues: getContactFormValues,
        reset: resetContactForm
    } = useForm<ContactFormValues>({
        mode: 'onChange'
    });

    const {
        fields: contacts,
        append: appendContact,
        remove: removeContact,
        replace: replaceContacts
    } = useFieldArray({
        control,
        name: 'contacts'
    });

    const [createAccount] = useCreateAccountMutation();
    const [isCreatingAccount, setCreatingAccount] = useState(false);
    const formReadOnly = isCreatingAccount || account != undefined;
    const { t } = useTranslation();

    const handleAddContact = () => {
        appendContact({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        });
    }

    const handleDeleteContact = (index: number) => {
        removeContact(index);
    }

    const handleCreateError = (err: any) => {
        if (!err.data) {
            toast.error(t('networkError'));
            return;
        }

        const details = err.data.details;
        if (!details) {
            toast.error(err.data.message);
            return;
        }

        Object.keys(details).forEach(key => setAccountFormError(
            key as keyof AccountFormValue,
            { message: details[key] })
        );

        if (details.contacts) {
            Object.entries(details.contacts).forEach(([index, fields]) => {
                Object.entries(fields as object).forEach(([fieldName, message]) => {
                    setContactFormError(`contacts.${index}.${fieldName}` as keyof ContactFormValues, { message });
                });
            });
        }
    }

    const handleCreateAccount = () => {
        setCreatingAccount(true);

        createAccount({
            userId,
            ...getAccountFormValues(),
            contacts: getContactFormValues().contacts
        }).unwrap()
            .then(onCreateAccount)
            .catch(handleCreateError)
            .finally(() => setCreatingAccount(false));
    }

    useEffect(() => {
        resetContactForm({ contacts: account?.contacts ?? [] });

        if (show) {
            resetAccountForm(account ?
                {
                    name: account.name ?? '',
                    phone: account.phone ?? '',
                    website: account.website ?? '',
                    industry: account.industry ?? ''
                } : {
                    name: '',
                    phone: '',
                    website: '',
                    industry: ''
                });
        }
    }, [show, resetContactForm, resetAccountForm, replaceContacts]);

    return <Modal show={show} onHide={onHide}>
        {!account && (
            <Modal.Header>{t('account.salesforce.modal.title')}</Modal.Header>
        )}
        <Modal.Body>
            <div>
                <h4>{t('account.salesforce.modal.titleAccount')}</h4>
                <AccountForm
                    register={registerAccountForm}
                    readOnly={formReadOnly}
                    errors={accountFormState.errors} />

                <h4>{t('account.salesforce.modal.titleContacts')}</h4>
                <ol>
                    {contacts?.map((field, i) => (
                        <li>
                            <ContactForm
                                id={field.id}
                                index={i}
                                errors={contactsFormState.errors?.contacts?.[i]}
                                register={registerContactForm}
                                readOnly={formReadOnly}
                                deleteDisabled={formReadOnly}
                                canDelete={!account}
                                onDeleteClick={() => handleDeleteContact(i)} />
                        </li>
                    ))}
                </ol>

                {!account && contacts.length < MAX_CONTACT_COUNT && (
                    <div
                        className="d-flex justify-content-center">
                        <Button
                            variant="outline-secondary"
                            disabled={formReadOnly}
                            onClick={handleAddContact}>{t('account.salesforce.modal.btnAddContact')}</Button>
                    </div>
                )}
                {account && contacts.length === 0 && (
                    <div>{t('account.salesforce.modal.noContacts')}</div>
                )}

                {!account && (
                    <>
                        <hr />
                        <div className="d-flex justify-content-center">

                            <Button
                                onClick={handleCreateAccount}
                                disabled={formReadOnly}>
                                {t('account.salesforce.modal.btnCreate')}
                            </Button>
                        </div>
                    </>
                )}


            </div>

        </Modal.Body>
    </Modal>
}

interface AccountFormProps {
    readOnly: boolean;
    errors?: any;
    register: UseFormRegister<AccountFormValue>
}

function AccountForm({ errors, readOnly, register }: AccountFormProps) {
    const nameError = errors?.name?.message;
    const industryError = errors?.industry?.message;
    const phoneError = errors?.phone?.message;
    const websiteError = errors?.website?.message;
    const { t } = useTranslation();
    return <Form>
        <Form.Group className="mb-3">
            <Form.Control
                type="text"
                readOnly={readOnly}
                placeholder={t('account.salesforce.modal.placeholder.name')}
                isInvalid={nameError != null}
                {...register('name')} />
            <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Control
                type="tel"
                placeholder={t('account.salesforce.modal.placeholder.phone')}
                readOnly={readOnly}
                isInvalid={phoneError != null}
                {...register('phone')} />
            <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Control
                type="text"
                readOnly={readOnly}
                isInvalid={industryError != null}
                placeholder={t('account.salesforce.modal.placeholder.industry')}
                {...register('industry')} />
            <Form.Control.Feedback type="invalid">{industryError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-5">
            <Form.Control
                type="url"
                readOnly={readOnly}
                placeholder={t('account.salesforce.modal.placeholder.website')}
                isInvalid={websiteError != null}
                {...register('website')} />
            <Form.Control.Feedback type="invalid">{websiteError}</Form.Control.Feedback>
        </Form.Group>

    </Form>
}

interface ContactFormProps {
    register: UseFormRegister<ContactFormValues>,
    id: string;
    index: number;
    errors?: any;
    readOnly: boolean;
    deleteDisabled: boolean;
    canDelete: boolean;
    onDeleteClick: () => void;
}

function ContactForm({ id, index, register, errors, readOnly, deleteDisabled, canDelete, onDeleteClick }: ContactFormProps) {
    const firstNameError = errors?.firstName?.message;
    const lastNameError = errors?.lastName?.message;
    const emailError = errors?.email?.message;
    const phoneError = errors?.phone?.message;
    const { t } = useTranslation();

    return <Form key={id}>
        <div className="d-flex mb-3 align-items-center">
            <div className="me-2">
                <div className="d-flex mb-2">
                    <Form.Group className="w-100 me-2">
                        <Form.Control
                            type="text"
                            readOnly={readOnly}
                            isInvalid={firstNameError != null}
                            placeholder={t('account.salesforce.modal.placeholder.firstName')}
                            {...register(`contacts.${index}.firstName`)} />
                        <Form.Control.Feedback type="invalid">{firstNameError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="w-100">
                        <Form.Control
                            type="text"
                            placeholder={t('account.salesforce.modal.placeholder.lastName')}
                            readOnly={readOnly}
                            isInvalid={lastNameError != null}
                            {...register(`contacts.${index}.lastName`)} />
                        <Form.Control.Feedback type="invalid">{lastNameError}</Form.Control.Feedback>
                    </Form.Group>
                </div>

                <div className="d-flex">
                    <Form.Group className="w-100 me-2">
                        <Form.Control
                            type="email"
                            placeholder={t('account.salesforce.modal.placeholder.email')}
                            readOnly={readOnly}
                            isInvalid={emailError != null}
                            {...register(`contacts.${index}.email`)} />
                        <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="w-100">
                        <Form.Control
                            type="tel"
                            placeholder={t('account.salesforce.modal.placeholder.phone')}
                            readOnly={readOnly}
                            isInvalid={phoneError != null}
                            {...register(`contacts.${index}.phone`)} />
                        <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                    </Form.Group>
                </div>
            </div>

            {canDelete && (
                <Button
                    disabled={deleteDisabled}
                    variant='outline-danger'
                    onClick={onDeleteClick}>
                    <MdDeleteOutline />
                </Button>
            )}
        </div>

    </Form>
}