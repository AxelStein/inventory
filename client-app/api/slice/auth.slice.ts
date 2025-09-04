import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserSettings } from 'api/user/user.types';

interface AuthState {
    user: User | null;
    settings: UserSettings | null;
}

const initialState: AuthState = {
    user: null,
    settings: null,
};

try {
    initialState.user = JSON.parse(localStorage.getItem('user') ?? '');
} catch (e) { }

const clearStorage = () => {
    removeUserFromStorage();
    removeSettingsFromStorage();
}

const removeSettingsFromStorage = () => {
    localStorage.removeItem('settings');
}

const removeUserFromStorage = () => {
    localStorage.removeItem('user');
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            if (state.user != null) {
                localStorage.setItem('user', JSON.stringify(state.user));
            } else {
                clearStorage();
            }
        },
        logout(state) {
            state.user = null;
            state.settings = null;
            clearStorage();
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;