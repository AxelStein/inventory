import type {UserApiModel} from "../user/user.api.model";

export interface SignInResponse {
    token: string | undefined;
    user: UserApiModel | undefined;
    userId: number | undefined;
    status: string | undefined;
    email: string | undefined;
}