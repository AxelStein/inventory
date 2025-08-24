import {Form} from "react-bootstrap";
import React from "react";

interface PasswordFormProps {
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

export default function PasswordForm({ disabled, onChange, error }: PasswordFormProps) {
    return <Form.Group className='mb-3' controlId='formPassword'>
        <Form.Control
            required
            type='password'
            placeholder='Password'
            disabled={disabled}
            onChange={onChange}
            isInvalid={error != null}
            name='password'/>
    </Form.Group>
}