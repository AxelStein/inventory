export interface UserApiModel {
    id: number;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    lastSeen: string;
}