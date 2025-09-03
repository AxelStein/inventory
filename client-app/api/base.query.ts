import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const createBaseQuery = (path: string) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: `${apiUrl}/${path}`,
        credentials: 'include',
    });
    const baseQueryWithReauth: BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError
    > = async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions)
        if (result.error && result.error.status === 401) {
            localStorage.removeItem('user');
        }
        return result
    }
    return baseQueryWithReauth;
}

export const makeApiPath = (path: string, asGuest?: boolean) => {
    const base = asGuest === true ? 'v1/guest' : 'v1/member';
    return `${base}/${path}`;
}