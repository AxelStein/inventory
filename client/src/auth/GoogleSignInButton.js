import React from 'react';
import authRepository from "../api/auth.repository";
import {GoogleLogin} from "@react-oauth/google";

const GoogleSignInButton = () => {
    const handleCredentialResponse = (response) => {
        authRepository.signInWithGoogle(response.credential)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    };
    return (
        <GoogleLogin onSuccess={handleCredentialResponse}/>
    );
};

export default GoogleSignInButton;