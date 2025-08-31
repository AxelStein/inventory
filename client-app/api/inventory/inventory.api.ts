import { createApi } from "@reduxjs/toolkit/query/react";
import type { DeleteImageProps, UploadImageProps } from "api/auth/auth.types";
import { createBaseQuery } from "api/base.query";
import type { PagingList } from "api/types";
import type { GetInventoriesProps, Inventory, UpdateInventoryProps } from "./inventory.types";

export const inventoryApi = createApi({
    reducerPath: "inventoryApi",
    baseQuery: createBaseQuery('v1/member/inventory'),
    endpoints: (builder) => ({
        getInventories: builder.query<PagingList<Inventory>, GetInventoriesProps>({
            query: (params) => ({
                url: '/list',
                params,
            }),
            keepUnusedDataFor: 0
        }),
        getInventoryById: builder.query<Inventory, number>({
            query: (id) => ({
                url: `/by-id/${id}`
            }),
            keepUnusedDataFor: 0
        }),
        createInventory: builder.mutation<Inventory, object>({
            query: (body) => ({
                url: '/create',
                method: 'post',
                body: body,
            })
        }),
        updateInventory: builder.mutation<Inventory, UpdateInventoryProps>({
            query: (params) => ({
                url: `/${params.id}/update`,
                method: 'post',
                body: params.body,
            })
        }),
        uploadImage: builder.mutation<Inventory, UploadImageProps>({
            query: ({ inventoryId, formData, version }) => ({
                url: `/${inventoryId}/upload-image`,
                method: 'post',
                params: { version },
                body: formData
            }),
        }),
        deleteImage: builder.mutation<Inventory, DeleteImageProps>({
            query: ({ inventoryId, version }) => ({
                url: `/${inventoryId}/delete-image`,
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
    useDeleteImageMutation
} = inventoryApi;