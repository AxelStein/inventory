import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { CreateSalesforceAccountProps, SalesforceAccount } from "./salesforce.types";

export const salesforceApi = createApi({
    reducerPath: 'salesforceApi',
    baseQuery: createBaseQuery('v1/member/salesforce'),
    endpoints: (builder) => ({
        getAccount: builder.query<SalesforceAccount, void>({
            query: () => ({
                url: `/account`
            }),
            keepUnusedDataFor: 0
        }),
        createAccount: builder.mutation<SalesforceAccount, CreateSalesforceAccountProps>({
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