import { useNavigate } from "react-router";
import { useCallback } from "react";
import type { SignInResponse } from "api/auth/auth.types";
import { useDispatch } from "react-redux";
import { signIn } from "api/slice/auth.slice";

export const useAuthSignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSignIn = useCallback((res: SignInResponse) => {
        if (res.status === 'verification_code_sent') {
            navigate(`/auth/verify-email?userId=${res?.userId}&email=${res?.email}`);
        } else {
            if (res) {
                dispatch(signIn(res));
            }
            navigate('/', { replace: true });
        }
    }, []);
    return { handleSignIn };
};