import type { PagingListProps } from "api/types";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole | string;
    salesforceAccountId: string;
    verified: boolean;
    isBlocked: boolean;
    lastSeen: Date;
}

export enum UserRole {
    admin = 'admin',
    user = 'user'
}

export interface UserSettings {
    theme: string;
    locale: string;
}

export interface GetUsersProps extends PagingListProps { }

export interface BlockUsersByIdsProps {
    ids: number[];
    block: boolean;
}

export interface DeleteUsersByIdsProps {
    ids: number[];
}

export interface ChangeUsersRolesByIdsProps {
    ids: number[];
    role: string;
}

export interface SaveUserSettingsProps {
    theme?: string;
    locale?: string;
}