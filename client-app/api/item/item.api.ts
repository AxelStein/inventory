import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery, makeApiPath } from "api/base.query";
import type { CreateItemProps, DeleteItemsByIdsProps, GetInventoryItemsProps, InventoryItem, UpdateItemProps } from "./item.types";
import type { PagingList } from "api/types";

export const itemApi = createApi({
    reducerPath: 'itemApi',
    baseQuery: createBaseQuery(''),
    endpoints: (builder) => ({
        getItems: builder.query<PagingList<InventoryItem>, GetInventoryItemsProps>({
            query: ({ asGuest, ...params }) => ({
                url: makeApiPath('inventory/item/list', asGuest),
                params: params
            }),
            keepUnusedDataFor: 0
        }),
        createItem: builder.mutation<InventoryItem, CreateItemProps>({
            query: ({ inventoryId, inventoryVersion, ...body }) => ({
                url: makeApiPath('inventory/item/create'),
                method: 'post',
                body: {
                    ...body,
                    inventoryId,
                    inventoryVersion
                },
            })
        }),
        updateItem: builder.mutation<InventoryItem, UpdateItemProps>({
            query: ({ itemId, inventoryId, inventoryVersion, version, ...body }) => ({
                url: makeApiPath(`inventory/item/${itemId}/update`),
                method: 'post',
                body: {
                    ...body,
                    inventoryId,
                    inventoryVersion,
                    version
                },
            })
        }),
        deleteItem: builder.mutation<void, number>({
            query: (itemId) => ({
                url: makeApiPath(`inventory/item/${itemId}`),
                method: 'delete',
                responseHandler: 'text'
            })
        }),
        deleteItemsByIds: builder.mutation<void, DeleteItemsByIdsProps>({
            query: (props) => ({
                url: makeApiPath(`inventory/item/delete-by-ids`),
                method: 'post',
                body: props,
                responseHandler: 'text'
            })
        }),
    })
});

export const {
    useGetItemsQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
    useDeleteItemsByIdsMutation
} = itemApi;