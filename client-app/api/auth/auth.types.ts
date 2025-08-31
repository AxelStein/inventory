import type { User } from "api/user/user.types";

export interface SignInResponse {
    token: string | undefined;
    user: User | undefined;
    userId: number | undefined;
    status: string | undefined;
    email: string | undefined;
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
