import { Alert, Form } from "react-bootstrap";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from 'react-toastify';
import { Trans, useTranslation } from "react-i18next";
import SubmitButton from "~/auth/components/SubmitButton";
import { useResetPasswordMutation, useRestorePasswordMutation } from "api/auth/auth.api";
import AppToastContainer from "~/components/AppToastContainer";
import { useForm } from "react-hook-form";

interface ResetPasswordForm {
    email: string;
    password: string;
}

export default function ResetPasswordPage() {
    const [isReset, setIsReset] = useState(false);
    const [isRestored, setIsRestored] = useState(false);
    const [requestExpired, setRequestExpired] = useState(null);
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const [resetPassword, { isLoading: resetPasswordLoading }] = useResetPasswordMutation();
    const [restorePassword, { isLoading: restorePasswordLoading }] = useRestorePasswordMutation();
    const isSubmit = resetPasswordLoading || restorePasswordLoading;
    const token = searchParams.get('token');
    const {
        register: registerForm,
        handleSubmit: handleFormSubmit,
        setError: setFormError,
        formState
    } = useForm<ResetPasswordForm>();

    const formErrors = formState.errors;
    const emailError = formErrors.email?.message;
    const passwordError = formErrors.password?.message;

    const handleError = useCallback((err: any) => {
        if (err.status == 410) {
            setRequestExpired(err.data.message);
            return;
        }

        const details = err.data.details;
        if (!details) {
            toast.error(err.data.message);
            return;
        }

        const emailError = details?.email;
        const passwordError = details?.password;
        if (emailError) {
            setFormError('email', { message: emailError });
        }
        if (passwordError) {
            setFormError('password', { message: passwordError })
        }
    }, []);

    const handleResetPassword = useCallback((email: string) => {
        resetPassword(email)
            .unwrap()
            .then(() => setIsReset(true))
            .catch(handleError);
    }, []);

    const handleRestorePassword = useCallback((token: string, password: string) => {
        restorePassword({ token, password })
            .unwrap()
            .then(() => setIsRestored(true))
            .catch(handleError);
    }, []);

    const handleSubmit = useCallback((form: ResetPasswordForm) => {
        if (token) {
            handleRestorePassword(token, form.password);
        } else {
            handleResetPassword(form.email);
        }
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

        <Form onSubmit={handleFormSubmit(handleSubmit)}>
            {token ? (
                <Form.Group className='mb-3' controlId='formPassword'>
                    <Form.Control
                        required
                        type='password'
                        placeholder={t('auth.inputPassword')}
                        disabled={isSubmit}
                        isInvalid={passwordError != null}
                        {...registerForm('password', { required: true })} />
                    <Form.Control.Feedback type='invalid'>{passwordError}</Form.Control.Feedback>
                </Form.Group>
            ) : (
                <Form.Group className='mb-3' controlId='formEmail'>
                    <Form.Control
                        required
                        type='email'
                        placeholder={t('auth.inputEmail')}
                        disabled={isSubmit}
                        isInvalid={emailError != null}
                        {...registerForm('email', { required: true })} />
                    <Form.Control.Feedback type='invalid'>{emailError}</Form.Control.Feedback>
                </Form.Group>
            )}

            <SubmitButton
                isSubmit={isSubmit}
                label={t(token ? 'auth.btnRestore' : 'auth.btnReset')} />
        </Form>

        <AppToastContainer />
    </>;
}