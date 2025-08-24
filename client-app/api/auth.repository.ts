import apiClient from "./api.client";

const BASE_URL = '/guest/auth';

const authRepository = {

    signIn: (body: object) => apiClient.post(`${BASE_URL}/sign-in`, body),

    signUp: (body: object) => apiClient.post(`${BASE_URL}/sign-up`, body),

    signOut: () => apiClient.post(`${BASE_URL}/sign-out`),

    signInWithGoogle: (token: string | undefined) => apiClient.post(`${BASE_URL}/google/sign-in`, {token}),

    resetPassword: (email: string) => apiClient.post(`${BASE_URL}/reset-password`, {email}),

    restorePassword: (token: string, password: string) => apiClient.post(`${BASE_URL}/restore-password`, {token, password}),

    verifyEmail: (userId: number, code: string) => apiClient.post(`${BASE_URL}/verify-email`, {userId, code}),
}

export default authRepository;