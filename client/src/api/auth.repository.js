import { LOCAL_USER } from "../constants.js";
import apiClient from "./api.client.js";

const saveUser = (res) => {
    localStorage.setItem(LOCAL_USER, JSON.stringify(res.data.user));
}

const repository = {

    signIn: (body) => apiClient.post('/auth/sign-in', body),

    signUp: (body) => apiClient.post('/auth/sign-up', body),

    signOut: () => {
        return apiClient.post('/auth/sign-out')
            .then(() => localStorage.removeItem(LOCAL_USER));
    },

    resetPassword: (email) => {
        return apiClient.post('/auth/reset-password', { email });
    },

    restorePassword: (token, password) => {
        return apiClient.post('/auth/restore-password', { token, password });
    },
}

export default repository;