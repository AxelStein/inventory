import {Form} from 'react-bootstrap';
import {type FormEvent, useCallback, useState} from "react";
import PasswordForm from "~/auth/components/PasswordForm";
import EmailForm from "~/auth/components/EmailForm";
import NameForm from "~/auth/components/NameForm";
import GoogleSignInButton from "~/auth/components/GoogleSignInButton";
import AppToastContainer from "~/components/AppToastContainer";
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import SubmitButton from "~/auth/SubmitButton";
import {useNavigate} from "react-router";
import authRepository from "../../api/auth/auth.repository";
import type {SignInResponse} from "../../api/auth/auth.response";
import ApiError from "../../api/api.error";

export default function AuthPage({isSignIn}: { isSignIn: boolean }) {
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const showErrorToast = useCallback((err: Error) => {
        toast.error(err.message);
    }, []);

    const handleError = useCallback((err: Error) => {
        if (err instanceof ApiError) {
            const name = err.getDetail('name');
            const email = err.getDetail('email');
            const password = err.getDetail('password');
            if (name || email || password) {
                setNameError(name);
                setEmailError(email);
                setPasswordError(password);
                return;
            }
        }
        showErrorToast(err);
    }, []);

    const onNameChange = useCallback(() => {
        setNameError(null);
    }, []);

    const onEmailChange = useCallback(() => {
        setEmailError(null);
    }, []);

    const onPasswordChange = useCallback(() => {
        setPasswordError(null);
    }, []);

    const handleSignIn = useCallback((res: SignInResponse) => {
        if (res.status === 'verification_code_sent') {
            navigate(`/auth/verify-email?userId=${res?.userId}&email=${res?.email}`);
        } else {
            navigate('/', {replace: true});
        }
    }, []);

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const body = {
            name: isSignIn ? undefined : form.get("name"),
            email: form.get("email"),
            password: form.get("password")
        };

        (isSignIn ? authRepository.signIn(body) : authRepository.signUp(body))
            .then(handleSignIn)
            .catch(handleError)
    }, []);

    return <>
        <h1 className='mb-5'>Inventory App</h1>

        <Form onSubmit={handleSubmit}>

            {!isSignIn && <NameForm error={nameError} onChange={onNameChange} disabled={isSubmit}/>}

            <EmailForm disabled={isSubmit} onChange={onEmailChange} error={emailError}/>

            <PasswordForm disabled={isSubmit} onChange={onPasswordChange} error={passwordError}/>

            <SubmitButton isSubmit={isSubmit} label={t(isSignIn ? 'auth.btnSignIn' : 'auth.btnSignUp')}/>

        </Form>

        <GoogleSignInButton handleSignIn={handleSignIn} handleError={handleError}/>

        {isSignIn && (
            <div className='text-center mt-3'>
                <a href='/auth/reset-password'>{t('auth.linkForgotPassword')}</a>

                <div className='mt-5'>
                    {t('auth.labelDontHaveAccount')} <a href='/auth/sign-up'>{t('auth.btnSignUp')}</a>
                </div>
            </div>
        )}

        {!isSignIn && (
            <div className='text-center mt-5'>
                {t('auth.labelHaveAccount')} <a href='/auth/sign-in'>{t('auth.btnSignIn')}</a>
            </div>
        )}

        <AppToastContainer/>
    </>;
}