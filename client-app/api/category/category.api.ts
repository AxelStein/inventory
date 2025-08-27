import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { InventoryCategory } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/member/inventory/category`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getCategories: builder.query<InventoryCategory[], void>({
            query: () => ({ url: '/list' })
        })
    }),
});

export const { useGetCategoriesQuery } = categoryApi;