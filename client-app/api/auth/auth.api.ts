import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { SignInResponse, RestorePasswordBody, VerifyEmailBody } from "./auth.types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: createBaseQuery('v1/guest/auth'),
    endpoints: (builder) => ({
        signIn: builder.mutation<SignInResponse, object>({
            query: (body) => ({
                url: '/sign-in',
                method: 'post',
                body: body
            })
        }),
        signUp: builder.mutation<SignInResponse, object>({
            query: (body) => ({
                url: '/sign-up',
                method: 'post',
                body: body
            })
        }),
        signOut: builder.mutation<void, void>({
            query: () => ({
                url: '/sign-out',
                method: 'post'
            })
        }),
        signInWithGoogle: builder.mutation<SignInResponse, string>({
            query: (token) => ({
                url: '/google/sign-in',
                method: 'post',
                body: { token }
            })
        }),
        resetPassword: builder.mutation<SignInResponse, string>({
            query: (email) => ({
                url: '/reset-password',
                method: 'post',
                body: { email }
            })
        }),
        restorePassword: builder.mutation<SignInResponse, RestorePasswordBody>({
            query: (body) => ({
                url: '/restore-password',
                method: 'post',
                body: body
            })
        }),
        verifyEmail: builder.mutation<SignInResponse, VerifyEmailBody>({
            query: (body) => ({
                url: '/verify-email',
                method: 'post',
                body: body
            })
        }),
    }),
});

export const {
    useSignInMutation, 
    useSignUpMutation, 
    useSignOutMutation, 
    useSignInWithGoogleMutation, 
    useVerifyEmailMutation, 
    useResetPasswordMutation, 
    useRestorePasswordMutation 
} = authApi;