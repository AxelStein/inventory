import { Form } from 'react-bootstrap';
import { useCallback } from "react";
import GoogleSignInButton from "~/auth/components/GoogleSignInButton";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import SubmitButton from "~/auth/components/SubmitButton";
import { useAuthSignIn } from "~/auth/components/useAuthSignIn";
import { Link } from "react-router";
import { useSignInMutation, useSignUpMutation } from 'api/auth/auth.api';
import AppToastContainer from '~/components/AppToastContainer';
import { useForm } from 'react-hook-form';

interface AuthForm {
    name: string;
    email: string;
    password: string;
}

export default function AuthPage({ isSignIn }: { isSignIn: boolean }) {
    const { t } = useTranslation();
    const { handleSignIn } = useAuthSignIn();
    const [signIn, { isLoading: signInLoading }] = useSignInMutation();
    const [signUp, { isLoading: signUpLoading }] = useSignUpMutation();
    const isSubmit = signInLoading || signUpLoading;
    const {
        register: registerAuthForm,
        handleSubmit: handleAuthSubmit,
        setError: setAuthFormError,
        formState: authFormState,
    } = useForm<AuthForm>();

    const authFormErrors = authFormState.errors;
    const nameError = authFormErrors.name?.message;
    const emailError = authFormErrors.email?.message;
    const passwordError = authFormErrors.password?.message;

    const handleError = useCallback((err: any) => {
        const details = err.data.details;
        if (!details) {
            toast.error(err.data.message);
            return;
        }

        const nameError = details?.name;
        const emailError = details?.email;
        const passwordError = details?.password;
        if (nameError) {
            setAuthFormError('name', { message: nameError });
        }
        if (emailError) {
            setAuthFormError("email", { message: emailError });
        }
        if (passwordError) {
            setAuthFormError("password", { message: passwordError });
        }
    }, []);

    const handleSubmit = useCallback((form: AuthForm) => {
        (isSignIn ? signIn(form) : signUp(form))
            .unwrap()
            .then(handleSignIn)
            .catch(handleError);
    }, []);

    return <>
        <h1 className='mb-5'>Inventory App</h1>

        <Form onSubmit={handleAuthSubmit(handleSubmit)}>

            {!isSignIn && (
                <Form.Group className='mb-3' controlId='formName'>
                    <Form.Control
                        required type='name'
                        placeholder={t('auth.inputName')}
                        isInvalid={nameError != null}
                        disabled={isSubmit}
                        {...registerAuthForm('name', { required: true })} />
                    <Form.Control.Feedback type='invalid'>{nameError}</Form.Control.Feedback>
                </Form.Group>
            )}

            <Form.Group className='mb-3' controlId='formEmail'>
                <Form.Control
                    required
                    type='email'
                    placeholder={t('auth.inputEmail')}
                    disabled={isSubmit}
                    isInvalid={emailError != null}
                    {...registerAuthForm('email', { required: true })} />
                <Form.Control.Feedback type='invalid'>{emailError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Control
                    required
                    type='password'
                    placeholder={t('auth.inputPassword')}
                    disabled={isSubmit}
                    isInvalid={passwordError != null}
                    {...registerAuthForm('password', { required: true })} />
                <Form.Control.Feedback type='invalid'>{passwordError}</Form.Control.Feedback>
            </Form.Group>

            <SubmitButton isSubmit={isSubmit} label={t(isSignIn ? 'auth.btnSignIn' : 'auth.btnSignUp')} />

        </Form>

        <GoogleSignInButton handleSignIn={handleSignIn} handleError={handleError} />

        {isSignIn && (
            <div className='text-center mt-3'>
                <Link to='/auth/reset-password'>{t('auth.linkForgotPassword')}</Link>

                <div className='mt-5'>
                    {t('auth.labelDontHaveAccount')} <Link to='/auth/sign-up' replace={true}>{t('auth.btnSignUp')}</Link>
                </div>
            </div>
        )}

        {!isSignIn && (
            <div className='text-center mt-5'>
                {t('auth.labelHaveAccount')} <Link to='/auth/sign-in' replace={true}>{t('auth.btnSignIn')}</Link>
            </div>
        )}

        <AppToastContainer />
    </>;
}