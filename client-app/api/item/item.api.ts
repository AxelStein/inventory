import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery, makeApiPath } from "api/base.query";
import type { GetInventoryItemsProps, InventoryItem } from "./item.types";
import type { PagingList } from "api/types";

export const itemApi = createApi({
    reducerPath: 'itemApi',
    baseQuery: createBaseQuery(''),
    endpoints: (builder) => ({
        getItems: builder.query<PagingList<InventoryItem>, GetInventoryItemsProps>({
            query: (props) => ({
                url: makeApiPath('inventory/item/list'),
                params: { ...props, asGuest: undefined }
            }),
            keepUnusedDataFor: 0
        }),
        createItem: builder.mutation<InventoryItem, any>({
            query: (props) => ({
                url: makeApiPath('inventory/item/create'),
                method: 'post',
                body: props
            })
        }),
    })
});

export const { useGetItemsQuery, useCreateItemMutation } = itemApi;