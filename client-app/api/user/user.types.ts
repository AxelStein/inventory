import type { PagingListProps } from "api/types";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    verified: boolean;
    isBlocked: boolean;
    lastSeen: Date;
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