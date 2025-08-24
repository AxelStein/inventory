import {Form} from "react-bootstrap";
import React from "react";
import {useTranslation} from "react-i18next";

interface VerificationCodeFormProps {
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

export default function VerificationCodeForm({ disabled, onChange, error }: VerificationCodeFormProps) {
    const { t } = useTranslation();
    return <Form.Group className='mb-3' controlId='formCode'>
        <Form.Control
            required
            type='text'
            placeholder={t('auth.emailVerification.inputCode')}
            disabled={disabled}
            onChange={onChange}
            isInvalid={error != null}
            name='code'/>
        <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
    </Form.Group>;
}