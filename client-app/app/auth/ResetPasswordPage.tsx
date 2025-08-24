import {Alert, Button, Form} from "react-bootstrap";
import PasswordForm from "~/auth/components/PasswordForm";
import {useState} from "react";
import {useSearchParams} from "react-router";
import EmailForm from "~/auth/components/EmailForm";
import AppToastContainer from "~/components/AppToastContainer";
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isRestored, setIsRestored] = useState(false);
    const [requestExpired, setRequestExpired] = useState(null);
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const onPasswordChange = () => {
        setPasswordError(null);
    }

    const onEmailChange = () => {
        setEmailError(null);
    }

    if (isReset) {
        return <div>Link to restore password has been sent to your email.</div>;
    }
    if (isRestored) {
        return (<div>Your password has been restored. <a href='/auth/sign-in'>Sign in</a> with new credentials</div>);
    }
    if (requestExpired) {
        return <Alert variant='danger'>{requestExpired}. Please <a href="/auth/reset-password">try again</a></Alert>
    }
    return <>
        <h1 className='mb-5'>{token ? 'Restore password' : 'Reset password'}</h1>

        <Form>
            {token ?
                <PasswordForm disabled={isSubmit} onChange={onPasswordChange} error={passwordError}/> :
                <EmailForm disabled={isSubmit} onChange={onEmailChange} error={emailError}/>
            }

            <Button
                className='w-100 mb-3'
                variant='outline-primary'
                type='submit'
                disabled={isSubmit}>
                {isSubmit ? 'Submit...' : token ? 'Restore' : 'Reset'}
            </Button>
        </Form>

        <AppToastContainer/>
    </>;
}