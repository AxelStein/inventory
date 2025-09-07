import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import { type User } from "./user.types";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: createBaseQuery('v1/member/user'),
    endpoints: (builder) => ({
        getUserAccountById: builder.query<User, any>({
            query: (id) => ({
                url: `/account/${id}`
            }),
            keepUnusedDataFor: 0
        }),
        deleteAccount: builder.mutation<void, void>({
            query: () => ({
                url: '/account',
                method: 'delete',
                responseHandler: 'text'
            })
        })
    })
});

export const {
    useGetUserAccountByIdQuery,
    useDeleteAccountMutation
} = userApi;