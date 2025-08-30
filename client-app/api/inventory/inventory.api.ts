import { createApi } from "@reduxjs/toolkit/query/react";
import type { UploadImageBody } from "api/auth/auth.types";
import { createBaseQuery } from "api/base.query";
import type { PagingList } from "api/types";
import type { GetInventoriesParams, Inventory } from "./inventory.types";

export const inventoryApi = createApi({
    reducerPath: "inventoryApi",
    baseQuery: createBaseQuery('v1/member/inventory'),
    endpoints: (builder) => ({
        getInventories: builder.query<PagingList<Inventory>, GetInventoriesParams>({
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
        updateInventory: builder.mutation<Inventory, object>({
            query: (body) => ({
                url: '/create',
                method: 'post',
                body: body,
            })
        }),
        uploadImage: builder.mutation<Inventory, UploadImageBody>({
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