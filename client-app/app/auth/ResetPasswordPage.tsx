import {Alert, Form} from "react-bootstrap";
import PasswordForm from "~/auth/components/PasswordForm";
import {type FormEvent, useCallback, useState} from "react";
import { useSearchParams} from "react-router";
import EmailForm from "~/auth/components/EmailForm";
import AppToastContainer from "~/components/AppToastContainer";
import { toast } from 'react-toastify';
import {Trans, useTranslation} from "react-i18next";
import SubmitButton from "~/auth/components/SubmitButton";
import authRepository from "../../api/auth/auth.repository";

export default function ResetPasswordPage() {
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isRestored, setIsRestored] = useState(false);
    const [requestExpired, setRequestExpired] = useState(null);
    const [searchParams] = useSearchParams();
    const {t} = useTranslation();

    const token = searchParams.get('token');

    const onPasswordChange = useCallback(() => {
        setPasswordError(null);
    }, []);

    const onEmailChange = useCallback(() => {
        setEmailError(null);
    }, []);

    const handleError = useCallback((err: any) => {
        const email = err.getDetail('email');
        const password = err.getDetail('password');
        if (email || password) {
            setEmailError(email);
            setPasswordError(password);
            return;
        } else if (err.status === 410) {
            setRequestExpired(err.message);
        } else {
            toast.error(err.message);
        }
    }, []);

    const resetPassword = useCallback((email: string) => {
        setIsSubmit(true);

        authRepository.resetPassword(email)
            .then(() => setIsReset(true))
            .catch(handleError)
            .finally(() => setIsSubmit(false));
    }, []);

    const restorePassword = useCallback((token: string, password: string) => {
        setIsSubmit(true);

        authRepository.restorePassword(token, password)
            .then(() => setIsRestored(true))
            .catch(handleError)
            .finally(() => setIsSubmit(false));
    }, []);

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const email = form.get("email");
        const password = form.get("password");

        token ? restorePassword(token as string, password as string) : resetPassword(email as string);
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