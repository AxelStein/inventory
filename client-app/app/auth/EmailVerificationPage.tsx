import { useTranslation } from "react-i18next";
import SubmitButton from "~/auth/components/SubmitButton";
import { useSearchParams } from "react-router";
import { Form } from "react-bootstrap";
import { useCallback } from "react";
import { useAuthSignIn } from "~/auth/components/useAuthSignIn";
import { toast } from 'react-toastify';
import { useVerifyEmailMutation } from "api/auth/auth.api";
import { useForm } from "react-hook-form";

interface VerificationCodeForm {
    code: string;
}

export default function EmailVerificationPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const userId = Number(searchParams.get('userId'));
    const email = searchParams.get('email');

    if (Number.isNaN(userId) || userId == 0) {
        return <div>{t('auth.emailVerification.error.userNotFound')}</div>;
    }

    const { handleSignIn } = useAuthSignIn();
    const [verifyEmail, { isLoading: verifyEmailLoading }] = useVerifyEmailMutation();

    const {
        register: registerForm,
        handleSubmit: handleFormSubmit,
        setError: setFormError,
        formState
    } = useForm<VerificationCodeForm>();

    const handleError = useCallback((err: any) => {
        const codeError = err.data.details?.code;
        if (codeError) {
            setFormError('code', { message: codeError });
        } else {
            toast.error(err.data.message);
        }
    }, []);

    const handleSubmit = useCallback((form: VerificationCodeForm) => {
        verifyEmail({ userId, code: form.code })
            .unwrap()
            .then(handleSignIn)
            .catch(handleError);
    }, []);

    return <>
        <h1>{t('auth.emailVerification.title')}</h1>
        <p>{t('auth.emailVerification.description', { email })}</p>
        <p className='mb-4 text-secondary'>{t('auth.emailVerification.hint')}</p>
        <Form onSubmit={handleFormSubmit(handleSubmit)}>
            <Form.Group className='mb-3' controlId='formCode'>
                <Form.Control
                    required
                    type='text'
                    placeholder={t('auth.emailVerification.inputCode')}
                    disabled={verifyEmailLoading}
                    isInvalid={formState.errors.code?.message != null}
                    {...registerForm('code', { required: true })} />
                <Form.Control.Feedback type='invalid'>{formState.errors.code?.message}</Form.Control.Feedback>
            </Form.Group>
            <SubmitButton
                isSubmit={verifyEmailLoading}
                label={t('auth.emailVerification.btnSubmit')} />
        </Form>
    </>;
}