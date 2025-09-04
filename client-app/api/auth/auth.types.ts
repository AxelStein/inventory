import type { User, UserSettings } from "api/user/user.types";

export interface SignInResponse {
    token?: string;
    user?: User;
    settings: UserSettings;
    userId?: number;
    status?: string;
    email?: string;
}

export interface UploadImageProps {
    inventoryId: number;
    version: number;
    formData: FormData;
}

export interface DeleteImageProps {
    inventoryId: number;
    version: number;
}

export interface RestorePasswordBody {
    token: string;
    password: string;
}

export interface VerifyEmailBody {
    userId: number;
    code: string;
}
