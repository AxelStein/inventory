export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    verified: boolean;
    isBlocked: boolean;
    lastSeen: string;
}

export interface UserSettings {
    theme: string;
    locale: string;
}