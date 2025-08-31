import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const publicUrl = import.meta.env.VITE_PUBLIC_URL;

export const localeApi = createApi({
    reducerPath: 'localeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${publicUrl}/locales`,
    }),
    endpoints: (builder) => ({
        getLocale: builder.query({
            query: (locale) => ({ url: `/${locale}` })
        }),
    }),
});

export const { useGetLocaleQuery } = localeApi;