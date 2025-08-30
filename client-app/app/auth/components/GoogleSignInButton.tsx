import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import { useSignInWithGoogleMutation } from "api/auth/auth.api";
import type { SignInResponse } from "api/auth/auth.types";
import {useCallback} from "react";
import { useTranslation } from "react-i18next";

interface GoogleSignInButtonProps {
    handleSignIn: (res: SignInResponse) => void;
    handleError: (err: Error) => void;
}

export default function GoogleSignInButton({ handleSignIn, handleError } : GoogleSignInButtonProps) {
    const [signInWithGoogle] = useSignInWithGoogleMutation();
    const {t} = useTranslation();

    const handleSuccess = useCallback((credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            handleError(new Error(t('auth.error.googleSignIn.noCredentials')));
            return;
        }
        signInWithGoogle(credentialResponse.credential)
            .unwrap()
            .then(handleSignIn)
            .catch(handleError);
    }, []);

    const handleGoogleLoginError = useCallback(() => {
        handleError(new Error(t('auth.error.googleSignIn.signInError')));
    }, []);

    return <GoogleLogin onSuccess={handleSuccess} onError={handleGoogleLoginError}/>;
}