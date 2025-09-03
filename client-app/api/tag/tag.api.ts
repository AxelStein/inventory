import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery, makeApiPath } from "api/base.query";
import type { GetTagsProps, InventoryTag } from "./tag.types";

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: createBaseQuery(''),
    endpoints: (builder) => ({
        getTags: builder.query<InventoryTag[], GetTagsProps>({
            query: (props) => ({
                url: makeApiPath('inventory/tag/list', props.asGuest)
            }),
        })
    })
});

export const { useGetTagsQuery } = tagApi;