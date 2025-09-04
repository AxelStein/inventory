import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { InventoryCustomId } from "./custom.id.types";

export const customIdApi = createApi({
    reducerPath: "customIdApi",
    baseQuery: createBaseQuery('v1/member/inventory/custom-id'),
    endpoints: (builder) => ({
        createCustomId: builder.mutation<void, number>({
            query: (itemId) => ({
                url: `/create`,
                method: 'post',
            })
        }),
        updateCustomId: builder.mutation<void, number>({
            query: (itemId) => ({
                url: `/${itemId}/update`,
                method: 'delete',
            })
        }),
        deleteCustomId: builder.mutation<void, number>({
            query: (itemId) => ({
                url: `/${itemId}`,
                method: 'delete',
            })
        }),
        getCustomIds: builder.query<InventoryCustomId[], number>({
            query: (inventoryId) => ({
                url: '/list',
                params: { inventoryId }
            }),
            keepUnusedDataFor: 0
        }),
    }),
});

export const { 
    useCreateCustomIdMutation, 
    useUpdateCustomIdMutation, 
    useDeleteCustomIdMutation, 
    useGetCustomIdsQuery 
} = customIdApi;