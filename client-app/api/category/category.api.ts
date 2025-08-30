import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { InventoryCategory } from "./category.types";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: createBaseQuery('v1/member/inventory/category'),
    endpoints: (builder) => ({
        getCategories: builder.query<InventoryCategory[], void>({
            query: () => ({ url: '/list' })
        })
    }),
});

export const { useGetCategoriesQuery } = categoryApi;