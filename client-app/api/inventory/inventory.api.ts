import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Inventory, PagingList, UploadImageProps } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;

export const inventoryApi = createApi({
    reducerPath: "inventoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/member/inventory`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getInventories: builder.query<PagingList<Inventory>, object>({
            query: (params) => ({
                url: '/list',
                params: params,
            }),
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
        updateInventory: builder.mutation<Inventory, object>({
            query: (body) => ({
                url: '/create',
                method: 'post',
                body: body,
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
    }),
});

export const { useGetInventoriesQuery, useGetInventoryByIdQuery, useCreateInventoryMutation, useUploadImageMutation } = inventoryApi;