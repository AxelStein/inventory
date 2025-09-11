import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { SalesforceAccount } from "./salesforce.types";

export const salesforceApi = createApi({
    reducerPath: 'salesforceApi',
    baseQuery: createBaseQuery('v1/member/salesforce'),
    endpoints: (builder) => ({
        getAccount: builder.query<SalesforceAccount, any>({
            query: () => ({
                url: `/account`
            }),
            keepUnusedDataFor: 0
        }),
        createAccount: builder.mutation<SalesforceAccount, SalesforceAccount>({
            query: (body) => ({
                url: '/account/create',
                method: 'post',
                body
            })
        }),
    })
});

export const {
    useGetAccountQuery,
    useCreateAccountMutation
} = salesforceApi;