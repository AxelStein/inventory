import { useNavigate } from "react-router";
import { useCallback } from "react";
import type { SignInResponse } from "api/auth/auth.types";

export const useAuthSignIn = () => {
    const navigate = useNavigate();
    const handleSignIn = useCallback((res: SignInResponse) => {
        if (res.status === 'verification_code_sent') {
            navigate(`/auth/verify-email?userId=${res?.userId}&email=${res?.email}`);
        } else {
            if (res.user) {
                localStorage.setItem('user', JSON.stringify(res.user));
            }
            navigate('/', { replace: true });
        }
    }, []);
    return { handleSignIn };
};