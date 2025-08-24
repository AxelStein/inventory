import { LOCAL_USER } from "../constants.js";
import apiClient from "./api.client.js";

const saveUser = (res) => {
    localStorage.setItem(LOCAL_USER, JSON.stringify(res.data.user));
}

const repository = {

    signIn: (body) => apiClient.post('/guest/auth/sign-in', body),

    signUp: (body) => apiClient.post('/guest/auth/sign-up', body),

    signOut: () => {
        return apiClient.post('/guest/auth/sign-out')
            .then(() => localStorage.removeItem(LOCAL_USER));
    },

    signInWithGoogle: (token) => apiClient.post('/guest/auth/google/sign-in', { token }),

    resetPassword: (email) => {
        return apiClient.post('/guest/auth/reset-password', { email });
    },

    restorePassword: (token, password) => {
        return apiClient.post('/guest/auth/restore-password', { token, password });
    },
}

export default repository;