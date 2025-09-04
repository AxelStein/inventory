import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'api/user/user.types';

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

try {
    initialState.user = JSON.parse(localStorage.getItem('user') ?? '');
} catch (e) {}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            if (state.user != null) {
                localStorage.setItem('user', JSON.stringify(state.user));
            } else {
                localStorage.removeItem('user');
            }
        },
        logout(state) {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;