import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { InventoryTag } from "./tag.types";

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: createBaseQuery('v1/member/inventory/tag'),
    endpoints: (builder) => ({
        getTags: builder.query<InventoryTag[], void>({
            query: () => ({ url: '/list' }),
        })
    })
});

export const { useGetTagsQuery } = tagApi;