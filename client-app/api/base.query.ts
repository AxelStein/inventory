import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL;

export const createBaseQuery = (path: string) => {
    return fetchBaseQuery({
        baseUrl: `${apiUrl}/${path}`,
        credentials: 'include',
    });
}

export const makeApiPath = (path: string, asGuest?: boolean) => {
    const base = asGuest === true ? 'v1/guest' : 'v1/member';
    return `${base}/${path}`;
}