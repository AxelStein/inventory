export interface UserApiModel {
    id: number;
    name: string;
    email: string;
    role: string;
    verified: boolean;
    isBlocked: boolean;
    lastSeen: string;
}