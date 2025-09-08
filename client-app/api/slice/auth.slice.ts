import { googleLogout } from '@react-oauth/google';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SignInResponse } from 'api/auth/auth.types';
import type { User, UserSettings } from 'api/user/user.types';

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

try {
    initialState.user = JSON.parse(localStorage.getItem('user') ?? '');
} catch (e) { }

const clearStorage = () => {
    removeUserFromStorage();
}

const removeUserFromStorage = () => {
    localStorage.removeItem('user');
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn(state, action: PayloadAction<SignInResponse>) {
            const settings = action.payload.settings;
            if (settings) {
                localStorage.setItem('theme', settings.theme);
                localStorage.setItem('locale', settings.locale);
            }

            state.user = action.payload.user ?? null;
            if (state.user != null) {
                localStorage.setItem('user', JSON.stringify(state.user));
            } else {
                clearStorage();
            }
        },
        logout(state) {
            state.user = null;
            clearStorage();
            googleLogout();
        },
    },
});

export const { signIn, logout } = authSlice.actions;
export default authSlice.reducer;