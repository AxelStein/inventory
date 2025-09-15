import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { CreateSupportTicketProps } from "./support.types";

export const supportApi = createApi({
    reducerPath: "supportApi",
    baseQuery: createBaseQuery('v1/member/support'),
    endpoints: (builder) => ({
        createSupportTicket: builder.mutation<void, CreateSupportTicketProps>({
            query: (props) => ({
                url: `/ticket/create`,
                method: 'post',
                body: props,
                responseHandler: 'text'
            })
        }),
    }),
});

export const {
    useCreateSupportTicketMutation
} = supportApi;