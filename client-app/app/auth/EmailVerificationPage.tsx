import {useTranslation} from "react-i18next";
import SubmitButton from "~/auth/SubmitButton";
import {useSearchParams} from "react-router";
import {Form} from "react-bootstrap";
import VerificationCodeForm from "~/auth/components/VerificationCodeForm";
import {useState} from "react";

export default function EmailVerificationPage() {
    const [searchParams] = useSearchParams();
    const [codeError, setCodeError] = useState(null);
    const { t } = useTranslation();

    const userId = searchParams.get('userId');
    if (!userId) {
        return <div>User not found</div>;
    }
    const email = searchParams.get('email');

    const handleCodeChange = () => {}

    return <>
        <h1>{t('auth.emailVerification.title')}</h1>
        <p>{t('auth.emailVerification.description', { email })}</p>
        <p className='mb-4 text-secondary'>{t('auth.emailVerification.hint')}</p>
        <Form>
            <VerificationCodeForm disabled={false} onChange={handleCodeChange} error={codeError}/>
            <SubmitButton isSubmit={false} label={t('auth.emailVerification.btnSubmit')}/>
        </Form>
    </>;
}