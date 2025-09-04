import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery, makeApiPath } from "api/base.query";
import type { CreateItemProps, GetInventoryItemsProps, InventoryItem, UpdateItemProps } from "./item.types";
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
        })
    })
});

export const { useGetItemsQuery, useCreateItemMutation, useUpdateItemMutation } = itemApi;