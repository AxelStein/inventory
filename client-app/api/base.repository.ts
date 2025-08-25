import {type AxiosInstance} from "axios";
import {handleApiError} from "./api.error.handler";

export class BaseRepository {

    constructor(
        private readonly api: AxiosInstance,
        private readonly baseUrl: string
    ) {};

    private mapUrl(url: string) {
        return `${this.baseUrl}${url}`;
    }

    async get<T>(url: string): Promise<T> {
        try {
            return (await this.api.get<T>(this.mapUrl(url))).data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async post<T>(url: string, data?: any): Promise<T> {
        try {
            return (await this.api.post<T>(this.mapUrl(url), data)).data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async put<T>(url: string, data: any): Promise<T> {
        try {
            return (await this.api.put<T>(this.mapUrl(url), data)).data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async delete<T>(url: string): Promise<T> {
        try {
            return (await this.api.delete<T>(this.mapUrl(url))).data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
}