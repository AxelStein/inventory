import {useTranslation} from "react-i18next";
import SubmitButton from "~/auth/components/SubmitButton";
import {useSearchParams} from "react-router";
import {Form} from "react-bootstrap";
import VerificationCodeForm from "~/auth/components/VerificationCodeForm";
import {type FormEvent, useCallback, useState} from "react";
import authRepository from "../../api/auth/auth.repository";
import {useAuthSignIn} from "~/auth/components/useAuthSignIn";
import { toast } from 'react-toastify';
import AppToastContainer from "~/components/AppToastContainer";

export default function EmailVerificationPage() {
    const [searchParams] = useSearchParams();
    const [codeError, setCodeError] = useState<string | null>(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const {t} = useTranslation();
    const {handleSignIn} = useAuthSignIn();

    const userId = searchParams.get('userId');
    if (!userId) {
        return <div>{t('auth.emailVerification.error.userNotFound')}</div>;
    }
    const email = searchParams.get('email');

    const handleCodeChange = useCallback(() => {
        setCodeError(null);
    }, []);

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const code = form.get('code');
        if (!code) {
            setCodeError(t('auth.emailVerification.error.codeEmpty'));
        } else {
            setIsSubmit(true);
            authRepository.verifyEmail(Number(userId), code as string)
                .then(handleSignIn)
                .catch(err => {
                    const code = err.getDetail('code');
                    if (code) {
                        setCodeError(code);
                    } else {
                        toast.error(err.message);
                    }
                })
                .finally(() => setIsSubmit(false));
        }
    }, []);

    return <>
        <h1>{t('auth.emailVerification.title')}</h1>
        <p>{t('auth.emailVerification.description', { email })}</p>
        <p className='mb-4 text-secondary'>{t('auth.emailVerification.hint')}</p>
        <Form onSubmit={handleSubmit}>
            <VerificationCodeForm disabled={isSubmit} onChange={handleCodeChange} error={codeError}/>
            <SubmitButton isSubmit={isSubmit} label={t('auth.emailVerification.btnSubmit')}/>
        </Form>
        <AppToastContainer/>
    </>;
}