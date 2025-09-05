import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { CreateCustomIdProps, InventoryCustomId, ReorderCustomIdsProps, UpdateCustomIdProps } from "./custom.id.types";

export const customIdApi = createApi({
    reducerPath: "customIdApi",
    baseQuery: createBaseQuery('v1/member/inventory/custom-id'),
    endpoints: (builder) => ({
        createCustomId: builder.mutation<InventoryCustomId, CreateCustomIdProps>({
            query: (props) => ({
                url: `/create`,
                method: 'post',
                body: props
            })
        }),
        updateCustomId: builder.mutation<InventoryCustomId, UpdateCustomIdProps>({
            query: ({ id, ...body }) => ({
                url: `/${id}/update`,
                method: 'post',
                body: body
            })
        }),
        deleteCustomId: builder.mutation<void, number>({
            query: (itemId) => ({
                url: `/${itemId}`,
                method: 'delete',
                responseHandler: 'text'
            })
        }),
        reorderCustomIds: builder.mutation<InventoryCustomId[], ReorderCustomIdsProps>({
            query: (props) => ({
                url: `/reorder`,
                method: 'put',
                body: props
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
    useGetCustomIdsQuery,
    useReorderCustomIdsMutation
} = customIdApi;