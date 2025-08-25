import apiClient from "../api.client";
import {BaseRepository} from "../base.repository";
import type {SignInResponse} from "./auth.response";

class AuthRepository extends BaseRepository {

    constructor() {
        super(apiClient, '/guest/auth');
    }

    signIn(body: object): Promise<SignInResponse> {
        return this.post<SignInResponse>('/sign-in', body);
    }

    signUp(body: object): Promise<SignInResponse> {
        return this.post<SignInResponse>('/sign-up', body);
    }

    signOut(): Promise<void> {
        return this.post('/sign-out');
    }

    signInWithGoogle(token: string): Promise<SignInResponse> {
        return this.post<SignInResponse>('/google/sign-in', {token});
    }

    resetPassword(email: string): Promise<void> {
        return this.post('/reset-password', {email});
    }

    restorePassword(token: string, password: string): Promise<void> {
        return this.post('/restore-password', {token, password});
    }

    verifyEmail(userId: number, code: string): Promise<SignInResponse> {
        return this.post('/verify-email', {userId, code});
    }
}

export default new AuthRepository();