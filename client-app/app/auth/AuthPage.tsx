import {Form, Button} from 'react-bootstrap';
import {type FormEvent, useState} from "react";
import PasswordForm from "~/auth/components/PasswordForm";
import EmailForm from "~/auth/components/EmailForm";
import NameForm from "~/auth/components/NameForm";
import GoogleSignInButton from "~/auth/components/GoogleSignInButton";
import AppToastContainer from "~/components/AppToastContainer";
import { toast } from 'react-toastify';
import authRepository from "../../api/auth.repository";

export default function AuthPage({isSignIn}: { isSignIn: boolean }) {
    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);

    const showErrorToast = (err: Error) => {
        toast.error(err.message);
    };

    const handleError = (err: Error) => {

    };

    const onNameChange = () => {
        setNameError(null);
    };

    const onEmailChange = () => {
        setEmailError(null);
    };

    const onPasswordChange = () => {
        setPasswordError(null);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const body = {
            name: isSignIn ? undefined : form.get("name"),
            email: form.get("email"),
            password: form.get("password")
        };

        (isSignIn ? authRepository.signIn(body) : authRepository.signUp(body))
            .then(res => {
                console.log(res);
            })
            .catch(handleError);
    };

    return <>
        <h1 className='mb-5'>Inventory App</h1>

        <Form onSubmit={handleSubmit}>

            {!isSignIn && <NameForm error={nameError} onChange={onNameChange} disabled={isSubmit}/>}

            <EmailForm disabled={isSubmit} onChange={onEmailChange} error={emailError}/>

            <PasswordForm disabled={isSubmit} onChange={onPasswordChange} error={passwordError}/>

            <Button
                className='w-100 mb-3'
                variant='outline-primary'
                type='submit'
                disabled={isSubmit}>
                {isSubmit ? 'Submit...' : (isSignIn ? 'Sign in' : 'Sign up')}
            </Button>

        </Form>

        <GoogleSignInButton handleError={handleError}/>

        {isSignIn && (
            <div className='text-center mt-3'>
                <a href='/auth/reset-password'>Forgot password?</a>

                <div className='mt-5'>
                    Don't have an account? <a href='/auth/sign-up'>Sign up</a>
                </div>
            </div>
        )}

        {!isSignIn && (
            <div className='text-center mt-5'>
                Already have an account? <a href='/auth/sign-in'>Sign in</a>
            </div>
        )}

        <AppToastContainer/>
    </>;
}