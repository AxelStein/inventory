import {Form} from "react-bootstrap";
import React from "react";

interface EmailFormProps {
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

export default function EmailForm({ disabled, onChange, error }: EmailFormProps) {
    return <Form.Group className='mb-3' controlId='formEmail'>
        <Form.Control
            required
            type='email'
            placeholder='Email'
            disabled={disabled}
            onChange={onChange}
            isInvalid={error != null}
            name='email'/>
        <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
    </Form.Group>;
}