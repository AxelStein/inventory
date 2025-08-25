import type {AxiosResponse} from "axios";

export default class ApiError extends Error {

    private constructor(
        public readonly status?: number,
        public readonly data?: any,
        message?: string
    ) {
        super(message);
        this.status = status;
        this.data = data;
    }

    public getDetails(): object | null {
        return this.data?.details ?? null;
    }

    public getDetail(name: string): string | null {
        return this.data?.details?.[name] ?? null;
    }

    public static fromResponse(response: AxiosResponse): ApiError {
        let message = response.data?.message;
        if (typeof response.data === 'string') {
            message = response.data;
        }
        return new ApiError(response.status, response.data, message);
    }

    public static fromMessage(message: string): ApiError {
        return new ApiError(undefined, undefined, message);
    }
}