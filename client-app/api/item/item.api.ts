import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { GetInventoryItemsProps, InventoryItem } from "./item.types";
import type { PagingList } from "api/types";

export const itemApi = createApi({
    reducerPath: 'itemApi',
    baseQuery: createBaseQuery('v1/member/inventory/item'),
    endpoints: (builder) => ({
        getItems: builder.query<PagingList<InventoryItem>, GetInventoryItemsProps>({
            query: (params) => ({
                url: '/list',
                params
            }),
            keepUnusedDataFor: 0
        }),
        createItem: builder.mutation<InventoryItem, any>({
            query: (props) => ({
                url: '/create',
                method: 'post',
                body: props
            })
        }),
    })
});

export const { useGetItemsQuery, useCreateItemMutation } = itemApi;