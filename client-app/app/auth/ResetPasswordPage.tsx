import {Alert, Button, Form} from "react-bootstrap";
import PasswordForm from "~/auth/components/PasswordForm";
import {useCallback, useState} from "react";
import {Link, useSearchParams} from "react-router";
import EmailForm from "~/auth/components/EmailForm";
import AppToastContainer from "~/components/AppToastContainer";
import { toast } from 'react-toastify';
import {Trans, useTranslation} from "react-i18next";
import SubmitButton from "~/auth/SubmitButton";

export default function ResetPasswordPage() {
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isRestored, setIsRestored] = useState(false);
    const [requestExpired, setRequestExpired] = useState(null);
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const token = searchParams.get('token');

    const onPasswordChange = useCallback(() => {
        setPasswordError(null);
    }, []);

    const onEmailChange = useCallback(() => {
        setEmailError(null);
    }, []);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event.currentTarget);
    }, []);

    if (isReset) {
        return <div>{t('auth.msgResetPasswordLinkSent')}</div>;
    }
    if (isRestored) {
        return <div>
            <Trans i18nKey='auth.msgPasswordRestored'>
                Your password has been restored. <a href='/auth/sign-in'>Sign in</a> with new credentials.
            </Trans>
        </div>;
    }
    if (requestExpired) {
        return <Alert variant='danger'>
            {requestExpired}. <Trans i18nKey="auth.msgPasswordResetExpired">Please <a href='/auth/reset-password'>try again</a></Trans>
        </Alert>
    }
    return <>
        <h1 className='mb-5'>{t(token ? 'auth.titleRestorePassword' : 'auth.titleResetPassword')}</h1>

        <Form onSubmit={handleSubmit}>
            {token ?
                <PasswordForm disabled={isSubmit} onChange={onPasswordChange} error={passwordError}/> :
                <EmailForm disabled={isSubmit} onChange={onEmailChange} error={emailError}/>
            }
            <SubmitButton isSubmit={isSubmit} label={t(token ? 'auth.btnRestore' : 'auth.btnReset')}/>
        </Form>

        <AppToastContainer/>
    </>;
}