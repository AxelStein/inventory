import { createApi } from "@reduxjs/toolkit/query/react";
import type { DeleteImageProps, UploadImageProps } from "api/auth/auth.types";
import { createBaseQuery, makeApiPath } from "api/base.query";
import type { PagingList } from "api/types";
import type { GetInventoriesProps, GetInventoryByIdProps, Inventory, UpdateInventoryProps } from "./inventory.types";

export const inventoryApi = createApi({
    reducerPath: "inventoryApi",
    baseQuery: createBaseQuery(''),
    endpoints: (builder) => ({
        getInventories: builder.query<PagingList<Inventory>, GetInventoriesProps>({
            query: (props) => ({
                url: makeApiPath('inventory/list', props.asGuest),
                params: { ...props, asGuest: undefined },
            }),
            keepUnusedDataFor: 0
        }),
        getInventoryById: builder.query<Inventory, GetInventoryByIdProps>({
            query: (props) => ({
                url: makeApiPath(`inventory/by-id/${props.id}`, props.asGuest)
            }),
            keepUnusedDataFor: 0
        }),
        createInventory: builder.mutation<Inventory, object>({
            query: (body) => ({
                url: makeApiPath('inventory/create'),
                method: 'post',
                body: body,
            })
        }),
        updateInventory: builder.mutation<Inventory, UpdateInventoryProps>({
            query: (params) => ({
                url: makeApiPath(`inventory/${params.id}/update`),
                method: 'post',
                body: params.body,
            })
        }),
        deleteInventory: builder.mutation<void, number>({
            query: (inventoryId) => ({
                url: makeApiPath(`inventory/${inventoryId}`),
                method: 'delete',
                responseHandler: 'text'
            })
        }),
        uploadImage: builder.mutation<Inventory, UploadImageProps>({
            query: ({ inventoryId, formData, version }) => ({
                url: makeApiPath(`inventory/${inventoryId}/upload-image`),
                method: 'post',
                params: { version },
                body: formData
            }),
        }),
        deleteImage: builder.mutation<Inventory, DeleteImageProps>({
            query: ({ inventoryId, version }) => ({
                url: makeApiPath(`inventory/${inventoryId}/delete-image`),
                method: 'delete',
                params: { version }
            }),
        }),
    }),
});

export const {
    useGetInventoriesQuery,
    useGetInventoryByIdQuery,
    useCreateInventoryMutation,
    useUpdateInventoryMutation,
    useUploadImageMutation,
    useDeleteInventoryMutation,
    useDeleteImageMutation
} = inventoryApi;