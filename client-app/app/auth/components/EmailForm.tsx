import {Form} from "react-bootstrap";
import React from "react";
import {useTranslation} from "react-i18next";

interface EmailFormProps {
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

export default function EmailForm({ disabled, onChange, error }: EmailFormProps) {
    const { t } = useTranslation();
    return <Form.Group className='mb-3' controlId='formEmail'>
        <Form.Control
            required
            type='email'
            placeholder={t('auth.inputEmail')}
            disabled={disabled}
            onChange={onChange}
            isInvalid={error != null}
            name='email'/>
        <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
    </Form.Group>;
}