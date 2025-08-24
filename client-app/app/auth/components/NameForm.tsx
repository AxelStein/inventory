import {Form} from "react-bootstrap";
import React from "react";
import {useTranslation} from "react-i18next";

interface NameFormProps {
    error: string | null;
    onChange: () => void;
    disabled: boolean;
}

export default function NameForm({ disabled, onChange, error }: NameFormProps) {
    const { t } = useTranslation();
    return <Form.Group className='mb-3' controlId='formName'>
        <Form.Control
            required type='name'
            placeholder={t('auth.inputName')}
            isInvalid={error != null}
            disabled={disabled}
            onChange={onChange}
            name='name'/>
        <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
    </Form.Group>
}