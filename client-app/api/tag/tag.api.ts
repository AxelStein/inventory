import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { InventoryTag } from "api/types";
import type { Option } from "react-bootstrap-typeahead/types/types";

const apiUrl = import.meta.env.VITE_API_URL;

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/member/inventory/tag`,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        getTags: builder.query<InventoryTag[], void>({
            query: () => ({ url: '/list' }),
        })
    })
});

export const { useGetTagsQuery } = tagApi;