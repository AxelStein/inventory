import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery, makeApiPath } from "api/base.query";
import { type DeleteTagProps, type CreateTagProps, type GetTagsProps, type InventoryTag } from "./tag.types";

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: createBaseQuery(''),
    endpoints: (builder) => ({
        getTags: builder.query<InventoryTag[], GetTagsProps>({
            query: (props) => ({
                url: makeApiPath('inventory/tag/list', props.asGuest)
            }),
            keepUnusedDataFor: 0
        }),
        createTag: builder.mutation<InventoryTag, CreateTagProps>({
            query: (props) => ({
                url: makeApiPath('inventory/tag/create'),
                method: 'post',
                body: props
            })
        }),
        deleteTag: builder.mutation<void, DeleteTagProps>({
            query: (props) => ({
                url: makeApiPath(`inventory/tag/${props.tagId}/from-inventory/${props.inventoryId}`),
                method: 'delete',
                body: props,
            }),
        })
    })
});

export const { 
    useGetTagsQuery,
    useCreateTagMutation, 
    useDeleteTagMutation 
} = tagApi;