import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import { type SaveUserSettingsProps, type User, type UserSettings } from "./user.types";

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
        }),
        saveUserSettings: builder.mutation<UserSettings, SaveUserSettingsProps>({
            query: (body) => ({
                url: '/settings/save',
                method: 'post',
                body
            })
        }),
    })
});

export const {
    useGetUserAccountByIdQuery,
    useDeleteAccountMutation,
    useSaveUserSettingsMutation
} = userApi;