import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "api/base.query";
import type { AppConfig } from "./app.types";

export const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: createBaseQuery('v1/guest/app'),
    endpoints: (builder) => ({
        getAppConfig: builder.query<AppConfig, void>({
            query: () => ({ url: '/config' })
        }),
    }),
});

export const { useGetAppConfigQuery } = appApi;