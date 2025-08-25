import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import authRepository from "../../../api/auth/auth.repository";
import {useCallback} from "react";
import type {SignInResponse} from "../../../api/auth/auth.response";

interface GoogleSignInButtonProps {
    handleSignIn: (res: SignInResponse) => void;
    handleError: (err: Error) => void;
}

export default function GoogleSignInButton({ handleSignIn, handleError } : GoogleSignInButtonProps) {

    const handleSuccess = useCallback((credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            handleError(new Error('No credential'));
            return;
        }
        authRepository.signInWithGoogle(credentialResponse.credential)
            .then(handleSignIn)
            .catch(handleError);
    }, []);

    const handleGoogleLoginError = useCallback(() => {
        handleError(new Error('Google login error'));
    }, []);

    return <GoogleLogin onSuccess={handleSuccess} onError={handleGoogleLoginError}/>;
}