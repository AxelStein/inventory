import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import authRepository from "../../../api/auth.repository";

interface GoogleSignInButtonProps {
    handleError: (err: Error) => void;
}

export default function GoogleSignInButton({ handleError } : GoogleSignInButtonProps) {

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        authRepository.signInWithGoogle(credentialResponse.credential)
            .then(res => console.log(res))
            .catch(handleError);
    };

    const handleGoogleLoginError = () => {
        handleError(new Error('Google login error'));
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleGoogleLoginError}/>;
}