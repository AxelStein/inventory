import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";

export const itemLikeApi = createApi({
    reducerPath: "itemLikeApi",
    baseQuery: createBaseQuery('v1/member/inventory/item/like'),
    endpoints: (builder) => ({
        likeItem: builder.mutation<void, number>({
            query: (itemId) => ({
                url: `/${itemId}`,
                method: 'post',
                responseHandler: 'text'
            })
        }),
        unlikeItem: builder.mutation<void, number>({
            query: (itemId) => ({
                url: `/${itemId}`,
                method: 'delete',
                responseHandler: 'text'
            })
        }),
    }),
});

export const { useLikeItemMutation, useUnlikeItemMutation } = itemLikeApi;