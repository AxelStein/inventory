import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import { type BlockUsersByIdsProps, type ChangeUsersRolesByIdsProps, type DeleteUsersByIdsProps, type GetUsersProps, type User } from "./user.types";
import type { PagingList } from "api/types";

export const userAdminApi = createApi({
    reducerPath: 'userAdminApi',
    baseQuery: createBaseQuery('v1/admin/user'),
    endpoints: (builder) => ({
        getUsers: builder.query<PagingList<User>, GetUsersProps>({
            query: (params) => ({
                url: `/list`,
                params
            }),
            keepUnusedDataFor: 0
        }),
        blockUsersByIds: builder.mutation<void, BlockUsersByIdsProps>({
            query: (body) => ({
                url: '/block-by-ids',
                method: 'post',
                body,
                responseHandler: 'text'
            })
        }),
        deleteUsersByIds: builder.mutation<void, DeleteUsersByIdsProps>({
            query: (body) => ({
                url: '/delete-by-ids',
                method: 'post',
                body,
                responseHandler: 'text'
            })
        }),
        changeUserRoleByIds: builder.mutation<void, ChangeUsersRolesByIdsProps>({
            query: (body) => ({
                url: '/change-role-by-ids',
                method: 'post',
                body,
                responseHandler: 'text'
            })
        }),
    })
});

export const {
    useGetUsersQuery,
    useBlockUsersByIdsMutation,
    useDeleteUsersByIdsMutation,
    useChangeUserRoleByIdsMutation
} = userAdminApi;